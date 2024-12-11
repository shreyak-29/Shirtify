import React, { useState } from 'react';

const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Access the environment variable


    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        try {
            // 1️⃣ Get Pre-signed URL from Backend
            const response = await fetch(`${backendUrl}generate-presigned-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: selectedFile.name, fileType: selectedFile.type })
            });

            const { url, key } = await response.json();

            if (!url) {
                alert('Failed to get the presigned URL');
                return;
            }

            // 2️⃣ Upload File to S3
            await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': selectedFile.type },
                body: selectedFile
            });

            // 3️⃣ Save the File URL in Backend Database
            const s3ImageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            await fetch(`${backendUrl}/api/save-image-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: s3ImageUrl })
            });

            setUploadStatus('Image uploaded and URL saved to the database!');
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploadStatus('Image upload failed');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Upload an Image to S3</h1>

            <input type="file" onChange={handleFileChange} />

            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
            >
                Upload Image
            </button>

            {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
        </div>
    );
};

export default ImageUploader;
