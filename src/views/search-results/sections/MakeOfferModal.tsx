import React, { useState } from 'react';
import { X, DollarSign, User, Mail, Phone, MessageSquare } from 'lucide-react';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string | null;
  propertyTitle?: string;
  propertyPrice?: string;
}

export function MakeOfferModal({ isOpen, onClose, propertyId, propertyTitle, propertyPrice }: MakeOfferModalProps) {
  const [offerAmount, setOfferAmount] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Offer submitted:', {
      propertyId,
      offerAmount,
      fullName,
      email,
      phone,
      message
    });
    
    setIsSubmitting(false);
    onClose();
    
    // Reset form
    setOfferAmount('');
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-[22px] font-semibold text-gray-900">Make an Offer</h2>
              {propertyTitle && (
                <p className="text-[14px] text-gray-500 mt-1">{propertyTitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Asking Price Info */}
            {propertyPrice && (
              <div className="bg-gradient-to-r from-[#4ea8a1]/10 to-[#4ea8a1]/5 border border-[#4ea8a1]/20 rounded-xl p-4">
                <p className="text-[13px] text-gray-600 mb-1">Current Asking Price</p>
                <p className="text-[24px] font-semibold text-gray-900">{propertyPrice}</p>
              </div>
            )}

            {/* Offer Amount */}
            <div>
              <label htmlFor="offerAmount" className="block text-[14px] font-medium text-gray-700 mb-2">
                Your Offer Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="offerAmount"
                  required
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="e.g., ₦40,000,000"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent text-[15px]"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-[14px] font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent text-[15px]"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-[14px] font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent text-[15px]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-[14px] font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent text-[15px]"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-[14px] font-medium text-gray-700 mb-2">
                Additional Message (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more about your interest..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ea8a1] focus:border-transparent text-[15px] resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl text-[15px] font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gradient-to-r from-[#4ea8a1] to-[#3d8882] text-white rounded-xl text-[15px] font-medium hover:shadow-lg hover:shadow-[#4ea8a1]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Offer'}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="px-6 pb-6">
            <p className="text-[12px] text-gray-500 text-center">
              By submitting, you agree to be contacted by the property owner or agent.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MakeOfferModal;