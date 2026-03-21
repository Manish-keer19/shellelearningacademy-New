const cloudinary = require('cloudinary').v2;

exports.uploadFileToCloudinary = async (file, folder, height, quality, isPdf = false) => {
  try {
    const options = { folder };

    // If height or quality provided, add them
    if (height) options.height = height;
    if (quality) options.quality = quality;

    // Use 'auto' to let Cloudinary detect the resource type (PDFs will be 'image')
    options.resource_type = 'auto';

    // Optional: you can restrict only .pdf files when isPdf = true
    if (isPdf && !file.name.endsWith('.pdf')) {
      throw new Error('Invalid file type. Expected a PDF.');
    }

    // Upload file
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};
