// config/minio.js

const { S3Client } = require("@aws-sdk/client-s3");

// MinIO configuration using AWS SDK S3Client
const minioClient = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || "http://192.168.149.128:9000",
  region: process.env.MINIO_REGION || "us-east-1",  // Any string works for MinIO
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "admin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "admin123",
  },
  // IMPORTANT: This tells AWS SDK NOT to use virtual-hosted-style URLs
  // MinIO requires path-style: http://host:9000/bucket/key
  // (not virtual: http://bucket.host:9000/key)
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "mybucket";

module.exports = { minioClient, BUCKET_NAME };