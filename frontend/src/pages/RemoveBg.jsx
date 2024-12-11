import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Upload, Image as ImageIcon, Loader2, Download, AlertCircle, ImageOff } from 'lucide-react';

const BgRemovalComponent = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [removedBgImage, setRemovedBgImage] = useState(null);
    const [error, setError] = useState(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(file);
        setRemovedBgImage(null);
        setError(null);
    };

    const handleRemoveBg = async () => {
        if (!image) return;
        const API_KEY =  import.meta.env.VITE_APP_REMOVE_BG_API_KEY;
        console.log(API_KEY);
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image_file", image);
            formData.append("size", "auto");

            const response = await axios.post(
                'https://api.remove.bg/v1.0/removebg',
                formData,
                {
                    headers: {
                        "X-Api-Key": API_KEY,
                    },
                    responseType: 'arraybuffer',
                }
            );

            const arrayBuffer = response.data;
            const blob = new Blob([arrayBuffer], { type: 'image/png' });
            const imgUrl = URL.createObjectURL(blob);

            setRemovedBgImage(imgUrl);
        } catch (err) {
            setError("Error removing background. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <ImageOff className="w-8 h-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-gray-900">Background Remover</h1>
                    </div>
                    <p className="text-gray-600">Upload an image to remove its background instantly</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* File Drop Area */}
                    <div
                        {...getRootProps()}
                        className={`border-3 border-dashed rounded-xl p-8 cursor-pointer text-center transition-all duration-200 
                            ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                    >
                        <input {...getInputProps()} />
                        {image ? (
                            <div className="relative group">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Uploaded"
                                    className="mx-auto max-h-64 rounded-lg shadow-md"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                    <p className="text-white flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        Change Image
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">Drag & drop an image here</p>
                                <p className="text-gray-400 text-sm">or click to select from your computer</p>
                            </div>
                        )}
                    </div>

                    {/* Process Button */}
                    <button
                        onClick={handleRemoveBg}
                        disabled={!image || loading}
                        className={`w-full mt-6 p-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200
                            ${!image ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                                loading ? 'bg-blue-400 text-white cursor-wait' :
                                    'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Image...
                            </>
                        ) : (
                            <>
                                <ImageIcon className="w-5 h-5" />
                                Remove Background
                            </>
                        )}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Result Section */}
                    {removedBgImage && (
                        <div className="mt-8 pt-8 border-t">
                            <h3 className="text-xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
                                <ImageIcon className="w-5 h-5 text-green-500" />
                                Background Removed
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <img
                                    src={removedBgImage}
                                    alt="Removed Background"
                                    className="mx-auto max-h-64 rounded-lg shadow-md"
                                />
                            </div>

                            <a
                                href={removedBgImage}
                                download="no-bg.png"
                                className="mt-6 w-full bg-green-500 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors font-medium"
                            >
                                <Download className="w-5 h-5" />
                                Download Image
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BgRemovalComponent;