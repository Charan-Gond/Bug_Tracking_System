import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import api from '../api/axios';

const OtpVerify = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Get email from navigation state or URL param
    const email = location.state?.email || new URLSearchParams(location.search).get('email');

    useEffect(() => {
        if (!email) {
            setError("No email found to verify. Please register again.");
        }
    }, [email]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await api.post('/otp/verify', {
                email: email,
                otp: data.otp
            });

            // Response model has { done: boolean, message: string }
            const isSuccess = response.data.done || response.data.isDone === true;

            if (isSuccess || response.data.message === "verify success") {
                setSuccess("Verification successful! Redirecting to login...");
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                setError(response.data.message || "Verification failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await api.post('/otp/send', { email });
            setSuccess("OTP resent successfully!");
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError("Failed to resend OTP");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Verify Email</h2>
                        <p className="text-gray-400">Enter the OTP sent to <span className="text-blue-400">{email}</span></p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-6 flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-lg p-3 mb-6 flex items-center gap-2">
                            <CheckCircle size={18} />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">OTP Code</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register('otp', { required: 'OTP is required' })}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all text-center tracking-[0.5em] text-lg font-bold"
                                    placeholder="• • • • • •"
                                />
                            </div>
                            {errors.otp && <p className="text-red-400 text-sm mt-1">{errors.otp.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Verify Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleResend}
                            className="text-gray-400 hover:text-white text-sm hover:underline"
                        >
                            Didn't receive code? Resend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerify;
