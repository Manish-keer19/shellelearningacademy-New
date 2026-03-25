const express = require("express");
const app = express();
const path = require("path");
const userRoutes = require("./routes/User");
const paymentRoutes = require("./routes/Payments");
const profileRoutes = require("./routes/Profile");
const CourseRoutes = require("./routes/Course");
const couponRoutes = require("./routes/Coupon");
const popupRoutes = require("./routes/Popup");
const applicationRoutes = require("./routes/Application");
const jobRoutes = require("./routes/Job");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const adminRoutes = require("./routes/Admin");
const adminEmsRoutes = require("./routes/ems/Admin.Ems");
const shellForms = require("./modules/ShellForms");
const shellFormsPublic = require("./modules/ShellForms/public.routes");

const database = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");


const { cloudnairyconnect } = require("./config/cloudinary");
const dotenv = require("dotenv");
const { updateStudentCount } = require("./seeds/updateStudentCount");
const { updateWorkshopStudentCount } = require("./seeds/updateWorkshopStudentCount");

const fileUpload = require("express-fileupload");
const { uploadFileInMinio } = require("./services/UploadMinIo");
dotenv.config();

const PORT = process.env.PORT || 5000;
database.connect();

app.use(express.json());
app.use(cookieParser());



app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);



// Store files in memory (not disk) so we can pass buffer directly to MinIO
const storage = multer.memoryStorage();

// File filter — only allow images and documents
// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/webp",
//     "image/gif",
//     "application/pdf",
//     "video/mp4",
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);  // Accept file
//   } else {
//     cb(new Error(`File type ${file.mimetype} is not allowed`), false);
//   }
// };


const fileFilter = (req, file, cb) => {
  cb(null, true); // ✅ allow all files
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit
  },
});

let corsOrigins;
try {
  corsOrigins = JSON.parse(process.env.CORS_ORIGIN);
} catch (error) {
  console.error("Error parsing CORS_ORIGIN:", error);
  corsOrigins = []; // Fallback to an empty array or a default value
}

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    maxAge: 14400,
  })
);



cloudnairyconnect();



app.get('/', (req, res) => {
  res.send('Hello Bro How Are You Welcome to Shell Backend');
});
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", CourseRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/contact", require("./routes/ContactUs"));
app.use("/api/v1/popup", popupRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/job-application", jobApplicationRoutes);
app.use("/api/v1/workshop", require("./routes/Workshop"));
app.use("/api/v1/bot", require("./routes/bot"));
app.use("/api/v1/lead", require("./routes/Lead"));
app.use("/api/v1/course-class", require("./routes/CourseClass"));
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin-ems", adminEmsRoutes);
app.use("/api/v1/certificate", require("./routes/Certificate"));
app.use("/api/v1/hero-image", require("./routes/HeroImage"));
app.use("/api/v1/shellforms", shellForms.adminRouter);
app.use("/api/v1/public/forms", shellFormsPublic);





app.post("/upload/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    

    // Generate a unique key using UUID to avoid collisions
    const ext = path.extname(file.originalname); // e.g., ".jpg"
    const objectKey = `images/${uuidv4()}${ext}`; // e.g., "images/uuid.jpg"

    // Upload buffer to MinIO
    const { url } = await uploadFileInMinio(file, objectKey, file.mimetype);

    console.log("ulr is ", url);

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        key: objectKey,
        url,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      },
      file
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
