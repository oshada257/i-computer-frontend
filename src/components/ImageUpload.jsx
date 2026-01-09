import { useState } from 'react';
import axios from 'axios';

export default function ImageUpload({ onImageUploaded, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      if (multiple) {
          Array.from(files).forEach(file => {
          formData.append('images', file);
        });

        const response = await axios.post(
          'http://localhost:3000/products/upload-images',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setUploadedImages(response.data.imagePaths);
        if (onImageUploaded) {
          onImageUploaded(response.data.imagePaths);
        }
      } else {
        formData.append('image', files[0]);

        const response = await axios.post(
          'http://localhost:3000/products/upload-image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setUploadedImages([response.data.imagePath]);
        if (onImageUploaded) {
          onImageUploaded(response.data.imagePath);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {uploading && (
        <p className="mt-2 text-sm text-gray-600">Uploading...</p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">Uploaded Images:</p>
          <div className="flex flex-wrap gap-2">
            {uploadedImages.map((path, index) => (
              <div key={index} className="relative">
                <img
                  src={`http://localhost:3000${path}`}
                  alt={`Uploaded ${index + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <p className="text-xs text-gray-600 mt-1 truncate w-24">
                  {path}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
