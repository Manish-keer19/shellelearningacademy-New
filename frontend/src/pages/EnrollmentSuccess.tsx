// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { Navbar } from '@/components/Navbar';
// import { Footer } from '@/components/Footer';
// import { CheckCircle, ArrowLeft, Phone, Mail } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { motion } from 'framer-motion';

// const EnrollmentSuccess = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [courseData, setCourseData] = useState<any>(null);

//   useEffect(() => {
//     // Get course data from URL params or localStorage
//     const courseName = searchParams.get('courseName') || 'Course';
//     const price = searchParams.get('price') || '0';
//     const originalPrice = searchParams.get('originalPrice') || price;
//     const courseId = searchParams.get('courseId');
    
//     const savedAmount = parseInt(originalPrice) - parseInt(price);
    
//     setCourseData({
//       name: courseName,
//       price: parseInt(price),
//       originalPrice: parseInt(originalPrice),
//       savedAmount: savedAmount > 0 ? savedAmount : 0,
//       courseId
//     });
//   }, [searchParams]);

//   if (!courseData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       <main className="container mx-auto px-4 py-24 max-w-4xl">
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="text-center"
//         >
//           {/* Success Icon */}
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <CheckCircle className="w-12 h-12 text-green-600" />
//           </div>

//           {/* Success Message */}
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//             🎉 Enrollment Successful!
//           </h1>
          
//           <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
//             Congratulations! You have been successfully enrolled in <span className="font-semibold text-primary">{courseData.name}</span>
//           </p>

//           {/* Course Details Card */}
//           <Card className="max-w-2xl mx-auto mb-8">
//             <CardContent className="p-8">
//               <div className="space-y-6">
//                 {/* Payment Details */}
//                 <div className="border-b pb-6">
//                   <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Course Price:</span>
//                       <span className="font-semibold">₹{courseData.price.toLocaleString()}</span>
//                     </div>
//                     {courseData.savedAmount > 0 && (
//                       <>
//                         <div className="flex justify-between items-center">
//                           <span className="text-muted-foreground">Original Price:</span>
//                           <span className="line-through text-muted-foreground">₹{courseData.originalPrice.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between items-center text-green-600">
//                           <span className="font-medium">You Saved:</span>
//                           <span className="font-bold">₹{courseData.savedAmount.toLocaleString()}</span>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="text-center">
//                   <h3 className="text-lg font-semibold mb-3">What's Next?</h3>
//                   <p className="text-muted-foreground mb-4">
//                     Our team will contact you shortly with course access details and next steps.
//                   </p>
                  
//                   <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
//                     <div className="flex items-center gap-2">
//                       <Phone className="w-4 h-4" />
//                       <span>Call support if needed</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Mail className="w-4 h-4" />
//                       <span>Check your email for updates</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button
//               onClick={() => navigate('/all-courses')}
//               variant="outline"
//               className="flex items-center gap-2"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Browse More Courses
//             </Button>
            
//             {courseData.courseId && (
//               <Button
//                 onClick={() => navigate(`/course-detail/${courseData.courseId}`)}
//                 className="bg-primary hover:bg-primary/90"
//               >
//                 View Course Details
//               </Button>
//             )}
//           </div>

//           {/* Additional Info */}
//           <div className="mt-12 p-6 bg-muted/30 rounded-xl max-w-2xl mx-auto">
//             <h4 className="font-semibold mb-2">Important Notes:</h4>
//             <ul className="text-sm text-muted-foreground space-y-1 text-left">
//               <li>• Course access will be provided within 24 hours</li>
//               <li>• You will receive a confirmation email shortly</li>
//               <li>• Our support team is available 24/7 for any queries</li>
//               <li>• All course materials are available for lifetime access</li>
//             </ul>
//           </div>
//         </motion.div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default EnrollmentSuccess;



import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckCircle, ArrowLeft, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Defined Interface for type safety
interface CourseSuccessData {
  name: string;
  price: number;
  originalPrice: number;
  savedAmount: number;
  courseId: string | null;
}

const EnrollmentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Using the defined interface
  const [courseData, setCourseData] = useState<CourseSuccessData | null>(null);

  useEffect(() => {
    const courseName = searchParams.get('courseName');
    const price = searchParams.get('price');
    const originalPrice = searchParams.get('originalPrice');
    const courseId = searchParams.get('courseId');

    // --- Data Validation & Fallback ---
    if (!courseName || !price || isNaN(Number(price))) {
      // Robust redirection if essential data is missing/invalid
      console.error("Missing or invalid enrollment data in URL params. Redirecting.");
      // Redirect to a safe page (e.g., dashboard)
      navigate('/dashboard', { replace: true }); 
      return;
    }
    
    const parsedPrice = parseInt(price) || 0;
    // Use price as fallback if originalPrice is missing
    const parsedOriginalPrice = parseInt(originalPrice || price) || parsedPrice;
    const savedAmount = parsedOriginalPrice - parsedPrice;
    
    setCourseData({
      name: courseName,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      savedAmount: savedAmount > 0 ? savedAmount : 0,
      courseId,
    });
  }, [searchParams, navigate]); // navigate added to dependencies

  if (!courseData) {
    // Improved Loading State
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24 max-w-4xl text-center">
          <div className="flex flex-col items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading enrollment details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper function for Navbar to keep JSX clean
  const navigateToCourse = () => {
      if (courseData.courseId) {
          navigate(`/course-detail/${courseData.courseId}`);
      }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
          role="status" // Added for accessibility
          aria-live="polite"
        >
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            🎉 Enrollment Successful!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Congratulations! You have been successfully enrolled in <span className="font-semibold text-primary">{courseData.name}</span>
          </p>

          {/* Course Details Card */}
          <Card className="max-w-2xl mx-auto mb-8 shadow-lg"> {/* Added a subtle shadow */}
            <CardContent className="p-8">
              <div className="space-y-6">
                
                {/* Payment Summary */}
                <div className="border-b pb-6">
                  <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-muted-foreground">Course Enrolled:</span>
                      <span className="text-foreground">{courseData.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Paid:</span>
                      <span className="font-semibold text-xl">₹{courseData.price.toLocaleString()}</span>
                    </div>
                    {courseData.savedAmount > 0 && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Original Price:</span>
                          <span className="line-through text-muted-foreground">₹{courseData.originalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-green-600">
                          <span className="font-bold">You Saved:</span>
                          <span className="font-bold">₹{courseData.savedAmount.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* What's Next Information */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
                  <p className="text-muted-foreground mb-4">
                    The course portal is now accessible. Your official welcome kit is in your inbox.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Check **{/* User email goes here */}** for access link</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>Support: +91-9406688303</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/all-courses')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse More Courses
            </Button>
            
            {courseData.courseId && (
              <Button
                onClick={navigateToCourse} // Use helper function
                className="bg-primary hover:bg-primary/90"
              >
                Go to My Course
              </Button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-xl max-w-2xl mx-auto">
            <h4 className="font-semibold mb-2 text-primary">Key Takeaways:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• Access is granted immediately; check your email (and spam folder).</li>
              <li>• You have **lifetime access** to all course materials and future updates.</li>
              <li>• Need help? Our support team is available 24/7.</li>
            </ul>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default EnrollmentSuccess;