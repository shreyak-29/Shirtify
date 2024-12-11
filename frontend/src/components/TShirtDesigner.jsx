import React, { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { Upload, Save, Trash2, Image, PaintBucket } from 'lucide-react';
import Tshirt from '../assets/Tshirt.png';
import BlackTshirt from '../assets/BlackTshirt.png';

const TShirtDesigner = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imagePositions, setImagePositions] = useState([]);
    const [tShirtColor, setTShirtColor] = useState('white');
    const fileInputRef = useRef(null);
    const tShirtRef = useRef(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL; 


    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newImages).then((images) => {
            setUploadedImages((prevImages) => [...prevImages, ...images]);
            setImagePositions((prevPositions) => [
                ...prevPositions,
                { x: 50, y: 50, width: 120, height: 120 },
            ]);
        });
    };

    const handlePositionChange = (index, newPosition) => {
        const updatedPositions = [...imagePositions];
        updatedPositions[index] = newPosition;
        setImagePositions(updatedPositions);
    };

    const handleRemoveImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        setImagePositions(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveImage = () => {
        html2canvas(tShirtRef.current).then((canvas) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Error: Image not generated');
                    return;
                }

                const USER_ID = localStorage.getItem('userID');
                const formData = new FormData();
                formData.append('image', new File([blob], 'tshirt-design.png', { type: 'image/png' }));
                formData.append('userId', USER_ID);

                axios.post(`${backendUrl}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                    .then(response => {
                        alert('Design saved successfully!');
                    })
                    .catch(error => {
                        alert('Error saving design. Please try again.');
                        console.error('Error:', error);
                    });
            });
        });
    };

    const handleTshirtColorChange = (e) => {
        setTShirtColor(e.target.value);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Custom T-Shirt Designer
                    </h1>
                    <p className="text-gray-600">Create your unique t-shirt design</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-80 bg-white rounded-xl shadow-lg p-6 h-fit">
                        <div className="flex items-center gap-2 mb-6">
                            <Image className="w-5 h-5 text-gray-700" />
                            <h2 className="text-xl font-semibold text-gray-800">
                                Design Library
                            </h2>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            {uploadedImages.length > 0 ? (
                                uploadedImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative group bg-gray-50 rounded-lg p-3 transition-all duration-200 hover:shadow-md border border-gray-100"
                                    >
                                        <img
                                            src={image}
                                            alt={`Design ${index + 1}`}
                                            className="w-full h-32 object-contain rounded-md"
                                        />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                                    <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                    <p>No designs uploaded yet</p>
                                    <p className="text-sm text-gray-400">Upload designs to get started</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Design Area */}
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <PaintBucket className="w-5 h-5 text-gray-700" />
                                <select
                                    className="px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={tShirtColor}
                                    onChange={handleTshirtColorChange}
                                >
                                    <option value="white">White T-Shirt</option>
                                    <option value="black">Black T-Shirt</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center mb-8">
                            <div className="relative w-96 h-[32rem]" ref={tShirtRef}>
                                <img
                                    src={tShirtColor === 'black' ? BlackTshirt : Tshirt}
                                    alt="T-shirt Template"
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-24 left-20 w-56 h-64 overflow-hidden">
                                    {uploadedImages.map((image, index) => (
                                        <Rnd
                                            key={index}
                                            position={{ x: imagePositions[index].x, y: imagePositions[index].y }}
                                            size={{
                                                width: imagePositions[index].width,
                                                height: imagePositions[index].height,
                                            }}
                                            onDragStop={(e, d) => {
                                                handlePositionChange(index, { ...imagePositions[index], x: d.x, y: d.y });
                                            }}
                                            onResizeStop={(e, direction, ref, delta, position) => {
                                                handlePositionChange(index, {
                                                    x: position.x,
                                                    y: position.y,
                                                    width: ref.offsetWidth,
                                                    height: ref.offsetHeight,
                                                });
                                            }}
                                            bounds="parent"
                                            minWidth={40}
                                            minHeight={40}
                                            maxWidth={180}
                                            maxHeight={180}
                                            lockAspectRatio={true}
                                        >
                                            <img
                                                src={image}
                                                alt={`Design ${index + 1}`}
                                                className="w-full h-full object-contain cursor-move"
                                            />
                                        </Rnd>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                                        transition-colors duration-200 focus:ring-2 focus:ring-blue-300 flex items-center gap-2"
                            >
                                <Upload className="w-5 h-5" />
                                Upload Design
                            </button>
                            <button
                                onClick={handleSaveImage}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 
                                        transition-colors duration-200 focus:ring-2 focus:ring-green-300 flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Save Design
                            </button>
                        </div>

                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TShirtDesigner;