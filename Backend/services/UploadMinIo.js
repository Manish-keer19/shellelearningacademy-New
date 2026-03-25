const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { minioClient, BUCKET_NAME } = require("../config/minio.js");

const fs = require("fs");

/**
 * Upload a file directly to MinIO
 * Supports both Multer (file.buffer) and Express-FileUpload (file.data or file.tempFilePath)
 * @param {object} file - File object
 * @param {string} objectKey - Destination key in bucket
 * @param {string} mimeType - MIME type (e.g., "image/png")
 */
async function uploadFileInMinio(file, objectKey, mimeType) {
    let body;
    let size;

    if (file.buffer) {
        body = file.buffer;
        size = file.size;
    } else if (file.data && file.data.length > 0) {
        body = file.data;
        size = file.size;
    } else if (file.tempFilePath) {
        body = fs.readFileSync(file.tempFilePath);
        size = fs.statSync(file.tempFilePath).size;
    } else {
        throw new Error("No file content found to upload");
    }

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        Body: body,
        ContentType: mimeType,
        ContentLength: size,
    });

    await minioClient.send(command).then((res) => {
        console.log("✅ MinIO Upload Success:", res);
    }).catch((error) => {
        console.error("❌ MinIO Upload Error:", error);
        throw error;
    });

    // Return the public URL (if bucket is public)
    const publicUrl = `${process.env.MINIO_ENDPOINT || "http://localhost:9000"}/${BUCKET_NAME}/${objectKey}`;
    return {
        url: publicUrl,
        key: objectKey
    };
}




/**
 * Delete a single object from MinIO
 * @param {string} objectKey - Key of the object to delete
 */
async function deleteFile(objectKey) {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
    });

    await minioClient.send(command);
    console.log(`🗑️ Deleted: ${objectKey}`);
}



/**
 * Download an object from MinIO as a Buffer
 * @param {string} objectKey - Key of the object to download
 * @returns {Buffer} File data
 */
async function getFile(objectKey) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
    });

    const response = await minioClient.send(command);

    // response.Body is a ReadableStream, convert to Buffer
    const chunks = [];
    for await (const chunk of response.Body) {
        chunks.push(chunk);
    }

    return Buffer.concat(chunks);
}

/**
 * Stream a file directly to an HTTP response (Express)
 * Better for large files — doesn't load entire file into memory
 * @param {string} objectKey - Object key in MinIO
 * @param {object} res - Express response object
 */
async function streamFile(objectKey, res) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
    });

    const response = await minioClient.send(command);

    // Set content type header from MinIO metadata
    res.setHeader("Content-Type", response.ContentType);
    res.setHeader("Content-Length", response.ContentLength);

    // Pipe the stream directly to HTTP response
    response.Body.pipe(res);
}

module.exports = {
    uploadFileInMinio,
    deleteFile,
    getFile,
    streamFile
};
