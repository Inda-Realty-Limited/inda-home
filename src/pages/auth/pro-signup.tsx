import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardButton from '@/components/dashboard/DashboardButton';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthService } from '@/services/pro-api';
import {
    FaUser, FaBuilding, FaEnvelope,
    FaCheckCircle, FaThLarge, FaArrowLeft, FaChevronDown,
    FaExclamationCircle
} from 'react-icons/fa';

interface SignupFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    companyName: string;
    companyType: string;
    registrationNumber: string;
    phoneNumber: string;
    primaryMarket: string;
    contactEmail: string;
    country: string;
    otp: string[];
}

const INITIAL_STATE: SignupFormData = {
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    companyName: '', companyType: '', registrationNumber: '', phoneNumber: '',
    primaryMarket: '', contactEmail: '', country: '',
    otp: ['', '', '', '', '', '']
};

export default function ProSignupPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<SignupFormData>(INITIAL_STATE);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...formData.otp];
        newOtp[index] = value;
        setFormData((prev) => ({ ...prev, otp: newOtp }));

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
        if (error) setError(null);
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.firstName || !formData.lastName) {
                    setError("Please enter your full name.");
                    return false;
                }
                if (!formData.email.includes('@')) {
                    setError("Please enter a valid email address.");
                    return false;
                }
                if (!formData.password || formData.password.length < 6) {
                    setError("Password must be at least 6 characters long.");
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match.");
                    return false;
                }
                break;
            case 2:
                if (!formData.companyName) {
                    setError("Company Name is required.");
                    return false;
                }
                if (!formData.companyType) {
                    setError("Please select a Company Type.");
                    return false;
                }
                if (!formData.registrationNumber) {
                    setError("Registration (RC) Number is required.");
                    return false;
                }
                break;
            case 3:
                if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
                    setError("Please enter a valid phone number.");
                    return false;
                }
                break;
            case 4:
                if (formData.otp.some(digit => digit === "")) {
                    setError("Please enter the complete 6-digit OTP.");
                    return false;
                }
                break;
        }
        return true;
    };

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(currentStep)) {
            window.scrollTo(0, 0);
            return;
        }

        if (currentStep === 3) {
            setIsLoading(true);
            try {
                const backendPayload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    companyName: formData.companyName,
                    companyType: formData.companyType,
                    registrationNumber: formData.registrationNumber,
                    phoneNumber: formData.phoneNumber
                };

                await AuthService.register(backendPayload);
                setIsLoading(false);
                setCurrentStep(4);
                window.scrollTo(0, 0);
            } catch (err: any) {
                setIsLoading(false);
                setError(err.message || "Registration failed.");
                window.scrollTo(0, 0);
            }
        }
        else if (currentStep === 4) {
            setIsLoading(true);
            try {
                const otpString = formData.otp.join('');
                const response = await AuthService.verifyOtp({
                    email: formData.email,
                    otp: otpString
                });
                localStorage.setItem('user', JSON.stringify(response.data));
                setIsLoading(false);
                setCurrentStep(5);
            } catch (err: any) {
                setIsLoading(false);
                setError(err.message || "Invalid OTP.");
            }
        }
        else if (currentStep < 4) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setError(null);
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
        else router.back();
    };

    if (currentStep === 5) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D6E6E] to-[#1A2E35]"
            >
                <div className="text-center animate-pulse">
                    <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                        <span className="opacity-50 border-r-2 border-white/20 pr-4 mr-4">Inda</span>
                        Welcome
                    </h1>
                </div>
                <RedirectHandler onComplete={() => router.push('/dashboard')} />
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-inda-light flex flex-col">
            <DashboardHeader />

            <main className="flex-grow flex flex-col items-center pt-12 pb-12 px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-inda-dark mb-8 text-center">
                    Build with Trust. Sell with Proof.
                </h1>

                <div className="bg-white w-full max-w-5xl rounded-3xl shadow-sm p-8 md:p-12 min-h-[600px] flex flex-col">

                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-500 text-sm font-medium hover:text-inda-dark transition-colors"
                        >
                            <FaArrowLeft className="mr-2" /> Back
                        </button>
                        <span className="text-sm font-medium text-gray-500">Step {currentStep} of 5</span>
                    </div>

                    <div className="flex flex-wrap justify-between items-start mb-10 gap-4 border-b border-gray-100 pb-8">
                        <StepItem icon={FaUser} label="Personal Details" stepNumber={1} currentStep={currentStep} />
                        <StepItem icon={FaBuilding} label="Company Info" stepNumber={2} currentStep={currentStep} />
                        <StepItem icon={FaEnvelope} label="Contact Details" stepNumber={3} currentStep={currentStep} />
                        <StepItem icon={FaCheckCircle} label="Verification" stepNumber={4} currentStep={currentStep} />
                        <StepItem icon={FaThLarge} label="Your Dashboard" stepNumber={5} currentStep={currentStep} />
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                            <FaExclamationCircle className="shrink-0 text-lg" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="max-w-lg mx-auto w-full flex-grow"
                        >
                            <h2 className="text-lg font-bold text-inda-dark mb-6 text-center md:text-left">
                                {currentStep === 1 && 'Personal Details'}
                                {currentStep === 2 && 'Company Info'}
                                {currentStep === 3 && 'Contact Details'}
                            </h2>

                            <form onSubmit={handleContinue} className="space-y-5">

                                {currentStep === 1 && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputGroup label="First Name" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} />
                                            <InputGroup label="Last Name" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
                                        </div>
                                        <InputGroup label="Email" name="email" type="email" placeholder="email@company.com" value={formData.email} onChange={handleChange} />
                                        <InputGroup label="Password" name="password" type="password" placeholder="Enter password" value={formData.password} onChange={handleChange} />
                                        <InputGroup label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} />
                                    </>
                                )}

                                {currentStep === 2 && (
                                    <>
                                        <InputGroup label="Company Name" name="companyName" placeholder="Enter Company Name" value={formData.companyName} onChange={handleChange} />
                                        <SelectGroup label="Company Type" name="companyType" value={formData.companyType} onChange={handleChange} options={['Real Estate Agency', 'Property Developer', 'Investment Firm']} placeholder="Select Company Type" />
                                        <InputGroup label="Registration Number" name="registrationNumber" placeholder="RC Number" value={formData.registrationNumber} onChange={handleChange} />
                                        <SelectGroup label="Primary Market" name="primaryMarket" value={formData.primaryMarket} onChange={handleChange} options={['Lekki', 'Ikoyi', 'Victoria Island', 'Mainland']} placeholder="Select Primary Market" />
                                    </>
                                )}

                                {currentStep === 3 && (
                                    <>
                                        <InputGroup label="Contact Email" name="contactEmail" type="email" placeholder="Enter Email Address" value={formData.contactEmail || formData.email} onChange={handleChange} />
                                        <InputGroup label="Phone Number" name="phoneNumber" placeholder="+234..." value={formData.phoneNumber} onChange={handleChange} />
                                        <SelectGroup label="Country" name="country" value={formData.country} onChange={handleChange} options={['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United Kingdom']} placeholder="Select your Country" />
                                    </>
                                )}

                                {currentStep === 4 && (
                                    <div className="text-center py-4">
                                        <h3 className="text-2xl font-bold text-inda-dark mb-2">Verify your email</h3>
                                        <p className="text-gray-500 text-sm mb-8">Please enter the 6-digit code we sent to your email.</p>

                                        <div className="flex justify-center gap-2 md:gap-4 mb-8">
                                            {formData.otp.map((digit, idx) => (
                                                <input
                                                    key={idx} id={`otp-${idx}`} type="text" maxLength={1} value={digit}
                                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                    className="w-12 h-12 md:w-14 md:h-14 border border-gray-200 rounded-lg text-center text-xl font-bold text-inda-dark focus:border-inda-teal focus:ring-2 focus:ring-inda-teal/20 outline-none transition bg-white shadow-sm"
                                                />
                                            ))}
                                        </div>

                                        <DashboardButton type="submit" variant="primary" className="w-48 py-3 mb-6" disabled={isLoading}>
                                            {isLoading ? 'Verifying...' : 'Verify'}
                                        </DashboardButton>

                                        <div className="flex flex-col items-center gap-2 text-sm">
                                            <button type="button" className="font-bold text-inda-dark hover:underline">Resend code</button>
                                            <span className="text-gray-400">Resend in 45s</span>
                                        </div>
                                    </div>
                                )}

                                {currentStep !== 4 && (
                                    <div className="flex justify-between items-center pt-8">
                                        <DashboardButton type="button" onClick={handleBack} variant="raw" className="bg-inda-dark text-white px-8 py-3 rounded hover:bg-black">
                                            Previous
                                        </DashboardButton>
                                        <DashboardButton type="submit" variant="primary" className="px-8 py-3" disabled={isLoading}>
                                            {isLoading ? 'Processing...' : 'Continue'}
                                        </DashboardButton>
                                    </div>
                                )}
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function RedirectHandler({ onComplete }: { onComplete: () => void }) {
    useEffect(() => { const timer = setTimeout(onComplete, 3000); return () => clearTimeout(timer); }, [onComplete]);
    return null;
}

interface StepItemProps {
    icon: React.ElementType;
    label: string;
    stepNumber: number;
    currentStep: number;
}

function StepItem({ icon: Icon, label, stepNumber, currentStep }: StepItemProps) {
    const isActive = currentStep === stepNumber;
    const isCompleted = currentStep > stepNumber;

    let bgClass = "border border-gray-200 text-gray-400";
    if (isActive) bgClass = "bg-inda-teal text-white shadow-md scale-110";
    if (isCompleted) bgClass = "bg-inda-light text-inda-teal border border-inda-teal";

    return (
        <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg transition-all duration-300 ${bgClass}`}>
                <Icon />
            </div>
            <span className={`text-sm font-medium hidden md:block ${isActive ? 'text-inda-dark' : 'text-gray-400'}`}>
                {label}
            </span>
        </div>
    );
}

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

function InputGroup({ label, className = '', ...props }: InputGroupProps) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
            <input
                {...props}
                className={`w-full bg-inda-light border border-inda-teal/30 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:border-inda-teal focus:ring-1 focus:ring-inda-teal placeholder-gray-400 transition-all ${className}`}
            />
        </div>
    );
}

interface SelectGroupProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: string[];
    placeholder?: string;
}

function SelectGroup({ label, options, placeholder, className = '', ...props }: SelectGroupProps) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <select
                    {...props}
                    className={`w-full bg-inda-light border border-inda-teal/30 rounded-md px-4 py-3 text-gray-700 appearance-none focus:outline-none focus:border-inda-teal focus:ring-1 focus:ring-inda-teal cursor-pointer ${className}`}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center h-full pointer-events-none text-inda-teal">
                    <FaChevronDown size={12} />
                </div>
            </div>
        </div>
    );
}
