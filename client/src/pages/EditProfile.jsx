import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Reference for the hidden file input
    const fileInputRef = useRef(null);

    // State for the image file and its preview URL
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        isEmailVerified: false,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setFormData((prev) => ({
                ...prev,
                email: storedUser.email || '',
                phone: storedUser.phone || '',
                address: storedUser.address || '',
                isEmailVerified: storedUser.isEmailVerified || false,
            }));

            // If the user already has a profile image URL saved in your DB, set it as the initial preview
            if (storedUser.profileImage) {
                setImagePreview(storedUser.profileImage);
            }
        }
    }, []);

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'phone') {
            value = value.replace(/[^\d+]/g, '');
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    // Handle the image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a temporary local URL to preview the selected image
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Trigger the hidden file input when the camera button is clicked
    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const API_URL = import.meta.env.VITE_API_URL || 'https://wildroute-pwa.onrender.com';

            const submitData = new FormData();
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('address', formData.address);

            // --- NEW: Safely append passwords if the user typed them ---
            if (formData.currentPassword && formData.newPassword) {
                submitData.append('currentPassword', formData.currentPassword);
                submitData.append('newPassword', formData.newPassword);
            }

            if (imageFile) {
                submitData.append('profileImage', imageFile);
            }

            const userId = storedUser._id || storedUser.id;
            const res = await axios.put(`${API_URL}/api/users/${userId}`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update the local storage
            localStorage.setItem('user', JSON.stringify(res.data));

            setLoading(false);
            navigate('/profile');
        } catch (error) {
            console.error("Update failed", error);
            setLoading(false);
            // NEW: Show the exact error from the backend if password is wrong
            alert(error.response?.data?.message || "Failed to update profile.");
        }
    };

    const handleVerifyEmail = () => {
        alert("Verification link sent to " + formData.email);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0e191b] flex flex-col text-[#1a535b] dark:text-white font-sans overflow-x-hidden transition-colors duration-300">

            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-[#0e191b]/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-white/5">
                <button onClick={() => navigate('/profile')} className="flex size-12 items-center justify-start">
                    <span className="material-symbols-outlined cursor-pointer">arrow_back_ios</span>
                </button>
                <h2 className="text-lg font-bold tracking-tight flex-1 text-center">Edit Profile</h2>
                <div className="w-12"></div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 pb-24">

                {/* Profile Image Section */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="relative">
                        <div className="size-32 rounded-full border-4 border-gray-200 dark:border-[#1a535b]/20 p-1 bg-gray-100 dark:bg-[#1a535b]/10 flex items-center justify-center overflow-hidden">
                            {/* Show image preview if available, else show default icon */}
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span className="material-symbols-outlined text-gray-400 dark:text-[#1a535b] text-6xl">person</span>
                            )}
                        </div>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <button
                            type="button"
                            onClick={handleCameraClick}
                            className="absolute bottom-1 right-1 bg-[#1a535b] text-white p-2 rounded-full border-2 border-white dark:border-[#0e191b] shadow-lg flex items-center justify-center hover:bg-[#134047] transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-white/50 uppercase tracking-widest font-bold">Tap icon to change photo</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSave} className="flex flex-col gap-6">

                    {/* Email & Verify */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold opacity-80">Email Address</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="flex-1 p-3.5 rounded-xl bg-white dark:bg-[#1a535b]/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#1a535b] dark:focus:border-[#9bbbbf] transition-colors"
                            />
                            {!formData.isEmailVerified ? (
                                <button type="button" onClick={handleVerifyEmail} className="px-4 rounded-xl bg-[#0bda54]/10 text-[#0bda54] border border-[#0bda54]/20 font-bold text-sm hover:bg-[#0bda54]/20 transition-colors">
                                    Verify
                                </button>
                            ) : (
                                <div className="px-4 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/50 border border-gray-200 dark:border-white/5 font-bold text-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Verified
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold opacity-80">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+94 77 123 4567"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3.5 rounded-xl bg-white dark:bg-[#1a535b]/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#1a535b] dark:focus:border-[#9bbbbf] transition-colors"
                        />
                    </div>

                    {/* Home Address */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold opacity-80">Home Address</label>
                        <textarea
                            name="address"
                            rows="3"
                            placeholder="Enter your full address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3.5 rounded-xl bg-white dark:bg-[#1a535b]/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#1a535b] dark:focus:border-[#9bbbbf] transition-colors resize-none"
                        ></textarea>
                    </div>

                    {/* Change Password Section */}
                    <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-gray-200 dark:border-white/10">
                        <h3 className="font-bold text-lg">Change Password</h3>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold opacity-60 uppercase tracking-wider">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                placeholder="••••••••"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full p-3.5 rounded-xl bg-white dark:bg-[#1a535b]/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#1a535b] dark:focus:border-[#9bbbbf] transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold opacity-60 uppercase tracking-wider">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="••••••••"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full p-3.5 rounded-xl bg-white dark:bg-[#1a535b]/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#1a535b] dark:focus:border-[#9bbbbf] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 mt-6 rounded-xl bg-[#1a535b] dark:bg-[#9bbbbf] text-white dark:text-[#0e191b] font-bold text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>

                </form>
            </div>
        </div>
    );
}
