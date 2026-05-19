import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadSingle = async (file, folder = 'fleeto/avatars') => {
  if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'your_api_key') {
    return { url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${file.filename}`, public_id: file.filename };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
  });
};

export const uploadMultiple = async (files) => {
  if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'your_api_key') {
    return files.map(file => ({ url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${file.filename}`, public_id: file.filename }));
  }

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        { folder: 'fleeto/bikes' },
        (error, result) => {
          if (error) reject(error);
          else resolve({ url: result.secure_url, public_id: result.public_id });
        }
      );
    });
  });

  return Promise.all(uploadPromises);
};

export default cloudinary;
