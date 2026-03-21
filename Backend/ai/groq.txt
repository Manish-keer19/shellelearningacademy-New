const axios = require("axios");
const Course = require("../models/Course");

// --- START: SHELL E-LEARNING ACADEMY KNOWLEDGE BASE ---
const SHELL_KNOWLEDGE_BASE = `
1. About Shell E-Learning Academy
Shell E-Learning Academy is a modern online learning platform offering industry-relevant, AI-powered QuickSkill programs designed to help students and professionals upgrade their skills in a short time. Our academy operates fully online with live classes, mentor support, practical projects, and recognized certifications. We are headquartered in Indore, Madhya Pradesh, and led by our Founder Kartik Gupta and Co-Founder Mayank Jain. We aim to make skill-based learning affordable, practical, and career-focused for everyone across India.

2. Courses / QuickSkill Programs Overview
We offer seven specialized 15-day QuickSkill programs, each designed to teach high-demand skills with practical training:
1. Data Analytics
2. Prompt Engineering
3. Cloud Computing
4. Cybersecurity
5. Digital Marketing Skills with AI
6. Advanced Paid Marketing
7. UI/UX and Graphic Designing

Every QuickSkill program costs ₹1299 and includes live classes, mentor guidance, practical learning, and certification.

3. What You Get in Every 15-Day QuickSkill Program
Each QuickSkill course includes the following benefits:
• 7 Live Classes conducted on alternate days
• 2 One-on-One Mentor Sessions for personalized guidance
• 1 Practical Project that must be submitted for certification
• 2 Official Certificates upon successful project submission
• Learn from Industry Experts with 5–6 years of real professional experience
• Evening Live Sessions from 6:00 PM to 8:00 PM
• Recorded Sessions Provided for revision
• AI-Based Curriculum designed to match current industry trends
• Full Practical Implementation using tools and real-world examples

This structure ensures you learn fast, gain practical experience, and build projects that strengthen your resume.

4. Class Format & Learning Experience
All classes are conducted live through Google Meet or Zoom, allowing students to interact directly with instructors, ask questions, and participate in real-time practical demonstrations. We also provide recorded videos, study materials, and assignments so you can revise anytime. The curriculum is hands-on and skill-based, focusing on practical usage rather than just theory.

5. Certifications
After completing your project, you will receive two professional certificates that are fully valid and can be added to your resume, LinkedIn profile, or job applications. Our certifications demonstrate that you have completed skill-based training and practical assignments under industry experts.

6. Placement & Internship Assistance
We have partnerships and tie-ups with multiple companies to help students with placement assistance and internship opportunities. While we do not offer 100% job guarantees, your outcomes depend on your skills, consistency, and performance.
Our career team also supports you by providing:
• Professional resume building
• Interview preparation guidance
• Opportunities for internships
• Job assistance through partner companies

We ensure you are ready for real industry roles.

7. Enrollment Process
You can easily enroll in any QuickSkill program by contacting us directly:
• WhatsApp: +91 94066 88303
• Email: admission@shellelearningacademy.com

Our team will guide you through selecting a course, understanding the syllabus, completing payment, and confirming your batch schedule.

8. Fees, Scholarships & EMI Options
Every QuickSkill program costs ₹1299 only.
We also offer:
• Scholarships for deserving students
• Flexible EMI options for easy payments

For eligibility and details, students can contact us on WhatsApp or email.

9. Refund Policy
Refunds are only applicable under valid reasons and must be requested before the batch start date. Once the batch has started, fees are non-refundable as seats, faculty hours, and resources are already allocated.

10. Support & Contact Details
For any doubts, help, or academic support, students can reach us at:
• Email: support@shellelearningacademy.com
• WhatsApp / Call: +91 94066 88303
• Head Office: Indore, Madhya Pradesh

Our support team will assist you throughout your learning journey.

11. Founders
Shell E-Learning Academy is led by passionate education entrepreneurs:
• Founder: Kartik Gupta
• Co-Founder: Mayank Jain

Their vision is to make high-quality skill education accessible and affordable for every student.

12. Quick Summary
Shell E-Learning Academy offers 7 professional QuickSkill programs—each 15 days, priced at ₹1299, including 7 live classes, 2 mentor sessions, practical project submission, and 2 certificates. Courses are taught by industry experts with 5–6 years of experience and focus on AI-based practical skills. We provide placement assistance, internship opportunities, resume building, and full support. Classes are held live from 6–8 PM via Meet or Zoom, with recordings available. Students can enroll via WhatsApp at +91 94066 88303 or email admission@shellelearningacademy.com. Headquarters: Indore, MP. Refunds apply only before batch start date. Scholarships and EMI options available.
`;
// --- END: KNOWLEDGE BASE ---

// --- CACHING CONFIGURATION ---
let cachedCourseDetails = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours cache

async function getCourseDetails() {
    const now = Date.now();

    // Return cached data if valid
    if (cachedCourseDetails && (now - lastCacheTime < CACHE_TTL)) {
        return cachedCourseDetails;
    }

    try {
        console.log("Fetching fresh course data from DB..."); // Log for debugging
        // 1. Fetch Course Data from DB
        const courses = await Course.find({ status: "Published" })
            .select("courseName courseDescription originalPrice discountedPrice discountPercent whatYouWillLearn courseLevel courseDuration category")
            .populate("category", "name description")
            .lean();

        // 2. Format Course Data for AI (Optimized Compact Format)
        let courseDetailsText = "Available Courses:\n";

        if (courses.length > 0) {
            courses.forEach((course, index) => {
                // Truncate description to save tokens
                const shortDesc = course.courseDescription.substring(0, 100) + "...";
                courseDetailsText += `${index + 1}. **${course.courseName}**: ${shortDesc} | ₹${course.discountedPrice} (${course.discountPercent}% OFF) | ${course.courseDuration}\n`;
            });
        } else {
            courseDetailsText += "No specific course details are currently available in the database.\n";
        }

        // Update Cache
        cachedCourseDetails = courseDetailsText;
        lastCacheTime = now;
        return courseDetailsText;

    } catch (error) {
        console.error("Error fetching courses for AI context:", error);
        // If fetch fails but we have old cache, return it as fallback
        if (cachedCourseDetails) return cachedCourseDetails;
        return "Course details are currently unavailable due to a technical error.";
    }
}

async function askAI(message) {
    try {
        let courseDetailsText = "";

        // 1. Intent Detection
        const courseKeywords = [
            'course', 'class', 'program', 'learn', 'study', 'fee', 'price', 'cost', 'pay', 'offer',
            'syllabus', 'duration', 'batch', 'enroll', 'admission', 'job', 'placement',
            'python', 'java', 'web', 'design', 'marketing', 'certificate', 'shell',
            'quickskill', 'quick skill', 'data analytics', 'prompt engineering', 'cloud computing',
            'cybersecurity', 'digital marketing', 'paid marketing', 'ui/ux', 'graphic designing',
            'mentor', 'internship', 'scholarship', 'emi', 'founder', 'kartik', 'mayank',
            'indore', 'refund', 'whatsapp', '1299', '15 day', 'live class'
        ];

        const shouldFetchCourses = courseKeywords.some(keyword => message.toLowerCase().includes(keyword));

        if (shouldFetchCourses) {
            courseDetailsText = await getCourseDetails();
        } else {
            courseDetailsText = "Course details not needed.";
        }

        // 3. Construct System Prompt (Compact)
        const fullSystemContent = `
You are Nexa, AI for Shell E-Learning Academy.
Your site is https://shellelearningacademy.com/

**RULES:**
1. **TRUTH:** Use ONLY the data below.
2. **SCOPE:** Shell Academy topics ONLY.
3. **ACCURACY:** No hallucinations.
4. **PRICING:** Exact values only.
5. **BREVITY:** Answer ONLY what is asked. Be short, concise, and direct. Do not provide extra information.

KNOWLEDGE BASE:
${SHELL_KNOWLEDGE_BASE}

COURSES:
${courseDetailsText}
`;

        // 4. Call Groq API
        const response = await axios({
            method: "POST",
            url: "https://api.groq.com/openai/v1/chat/completions",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            data: {
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: fullSystemContent
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.2,
                max_tokens: 350
            }
        });

        return response.data.choices[0].message.content;

    } catch (error) {
        console.log("Groq API Error:", error.response?.data || error.message);

        if (error.response?.status === 429) {
            return "I'm receiving too many messages at once. Please wait 10-20 seconds and try again. ⏳";
        }

        return "I apologize, I'm having trouble connecting right now. Please try again.";
    }
}

module.exports = { askAI };