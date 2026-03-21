const mongoose = require("mongoose");
const dotenv = require("dotenv");
const crypto = require("crypto");

// Load models
const ShellForm = require("./modules/ShellForms/forms/form.model");
const ShellQuestion = require("./modules/ShellForms/questions/question.model");
const User = require("./models/User");

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function seed() {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to database");

    // Get an admin user
    const user = await User.findOne({ accountType: "Admin" }) || await User.findOne();
    if (!user) {
      console.error("No user found to assign as creator");
      process.exit(1);
    }

    // Generate a random ID-like slug for the form
    const randomSlug = crypto.randomBytes(8).toString("hex");

    // --- MEGA WORKSHOP FORM ---
    const form = await ShellForm.create({
      title: "Master Workshop Enrollment 2026",
      description: "This form contains all available question types for comprehensive testing.",
      status: "Published",
      slug: randomSlug,
      thankYouMessage: "Your enrollment for the Master Workshop has been received!",
      createdBy: user._id
    });

    const questions = [
      {
        questionText: "Full Name",
        questionType: "short_text",
        required: true,
      },
      {
        questionText: "Why do you want to join this workshop?",
        questionType: "long_text",
        required: false,
      },
      {
        questionText: "Contact Email",
        questionType: "email",
        required: true,
      },
      {
        questionText: "Phone Number",
        questionType: "phone",
        required: false,
      },
      {
        questionText: "Years of Experience",
        questionType: "number",
        required: true,
      },
      {
        questionText: "Select your primary track",
        questionType: "dropdown",
        options: [
          { label: "Frontend", value: "frontend" },
          { label: "Backend", value: "backend" },
          { label: "Fullstack", value: "fullstack" },
          { label: "DevOps", value: "devops" }
        ],
        required: true,
      },
      {
        questionText: "Gender",
        questionType: "radio",
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" }
        ],
        required: true,
      },
      {
        questionText: "Which technologies do you know?",
        questionType: "checkbox",
        options: [
          { label: "React", value: "react" },
          { label: "Node.js", value: "node" },
          { label: "Python", value: "python" },
          { label: "Docker", value: "docker" }
        ],
        required: false,
      },
      {
        questionText: "Preferred Start Date",
        questionType: "date",
        required: true,
      },
      {
        questionText: "Rate your current skill level",
        questionType: "rating",
        required: true,
      }
    ];

    // Add formId and order to each question
    const questionsToInsert = questions.map((q, index) => ({
      ...q,
      formId: form._id,
      order: index
    }));

    await ShellQuestion.insertMany(questionsToInsert);

    console.log("\n--------------------------------------------------");
    console.log("✅ SEEDING COMPLETED SUCCESSFULLY!");
    console.log(`Form Title: ${form.title}`);
    console.log(`Generated Slug: ${form.slug}`);
    console.log(`Public URL: http://localhost:8080/f/${form.slug}`);
    console.log("--------------------------------------------------\n");

    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:");
    console.error(err);
    process.exit(1);
  }
}

seed();
