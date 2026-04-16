import React, { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { CheckCircle2, Loader2, Info } from 'lucide-react';

// Common visual style for Stripe elements to match regular Tailwind inputs
const stripeElementOptions = {
    style: {
        base: {
            fontSize: '15px',
            color: '#374151',
            fontFamily: '"Inter", "system-ui", sans-serif',
            '::placeholder': {
                color: '#9ca3af',
            },
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444',
        },
    },
};

const StripePaymentForm = ({ clientSecret, onPaymentSuccess, onCancel, orderSummary }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    // UI states
    const [name, setName] = useState('');
    const [saveDetails, setSaveDetails] = useState(true);
    
    // Process states
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        const cardElement = elements.getElement(CardNumberElement);

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: name,
                    }
                },
                // setup_future_usage would be used here if saveDetails is true, 
                // but for mockup purposes we keep it simple to intent status.
            }
        );

        if (stripeError) {
            setError(stripeError.message);
            setProcessing(false);
        } else if (paymentIntent.status === 'succeeded') {
            setSuccess(true);
            setTimeout(() => {
                onPaymentSuccess(paymentIntent.id);
            }, 1000);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Derived values from orderSummary prop
    const total = orderSummary?.total || 0;
    const items = orderSummary?.items || [];

    // SUCCESS STATE
    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] w-full bg-white rounded-3xl animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-500 text-center max-w-sm mb-6">
                    Your token payment of <span className="font-semibold text-gray-800">{formatCurrency(total)}</span> has been securely processed.
                </p>
                <div className="animate-pulse text-sm text-gray-400 font-medium">Redirecting you to the group...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row w-full bg-white rounded-2xl overflow-hidden shadow-sm">
            
            {/* LEFT COLUMN: Payment Inputs */}
            <div className="flex-1 p-8 relative">
                
                {/* Loader Overlay */}
                {processing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center transition-all">
                        <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
                        <span className="text-lg font-semibold text-gray-800">Processing Payment...</span>
                        <span className="text-sm text-gray-500 mt-1">Please do not close this window</span>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
                    <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">Cancel</button>
                </div>

                {/* Mock Saved Cards */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-3">Your Card</p>
                    <div className="flex gap-4">
                        {/* Selected Card Mock */}
                        <div className="h-16 w-24 border-2 border-transparent shadow-[0_4px_14px_rgba(0,0,0,0.05)] rounded-lg flex flex-col items-center justify-center cursor-pointer transition-transform hover:-translate-y-1 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 mb-1 relative z-10" />
                           <span className="text-[10px] text-gray-400 font-medium relative z-10">***3137</span>
                        </div>
                        {/* Unselected Card Mocks */}
                        <div className="h-16 w-24 border border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-transform hover:-translate-y-1 bg-white hover:border-gray-300 shadow-sm opacity-60">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 mb-1" />
                           <span className="text-[10px] text-gray-400 font-medium">***6482</span>
                        </div>
                        <div className="h-16 w-24 border border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-transform hover:-translate-y-1 bg-white hover:border-gray-300 shadow-sm opacity-60 flex-shrink-0 hidden sm:flex">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 mb-1" />
                           <span className="text-[10px] text-gray-400 font-medium">***2390</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <Info size={16} />
                        {error}
                    </div>
                )}

                {/* Form Elements */}
                <form onSubmit={handleSubmit}>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-4">Add New Card</p>
                    
                    <div className="space-y-5">
                        {/* Card Holder Name */}
                        <div>
                            <label className="block text-sm text-gray-600 font-semibold mb-1.5">Card Holder Name</label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors placeholder:text-gray-400 text-gray-800 font-medium"
                                placeholder="e.g. Parth Patel"
                                required
                            />
                        </div>

                        {/* Card Number */}
                        <div>
                            <label className="block text-sm text-gray-600 font-semibold mb-1.5">Card number</label>
                            <div className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-colors">
                                <CardNumberElement options={stripeElementOptions} />
                            </div>
                        </div>

                        {/* Split Row for Expiry, CVV, and Card Type Icons */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 font-semibold mb-1.5">Expiry Date</label>
                                <div className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-colors h-12 flex items-center">
                                    <div className="w-full relative top-[-1px]">
                                        <CardExpiryElement options={stripeElementOptions} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-1/3 min-w-[80px]">
                                <label className="block text-sm text-gray-600 font-semibold mb-1.5 text-center">CVV</label>
                                <div className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-colors h-12 flex items-center relative">
                                    <div className="w-full relative top-[-1px]">
                                        <CardCvcElement options={stripeElementOptions} />
                                    </div>
                                    <span className="absolute right-3 text-gray-300 bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">?</span>
                                </div>
                            </div>

                            <div className="w-auto ml-2 flex-col justify-end hidden sm:flex">
                                <label className="block text-sm text-gray-600 font-semibold mb-1.5 sr-only">Card Type</label>
                                <div className="flex gap-1.5 h-12 items-center">
                                    <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 h-8 flex items-center shadow-sm">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-3.5" />
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 h-8 flex items-center shadow-sm">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2.5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Details Checkbox */}
                        <div className="flex items-center gap-2 mt-2">
                            <input 
                                type="checkbox" 
                                id="saveDetails" 
                                checked={saveDetails} 
                                onChange={(e) => setSaveDetails(e.target.checked)}
                                className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="saveDetails" className="text-sm text-gray-600 cursor-pointer font-medium select-none">
                                Save my details for future payment
                            </label>
                        </div>
                    </div>

                    {/* Footer / Submit Row */}
                    <div className="mt-10 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-semibold mb-0.5 uppercase tracking-wide">Total</p>
                            <p className="text-2xl font-bold text-blue-500 leading-none">{formatCurrency(total)}</p>
                        </div>
                        <button 
                            type="submit" 
                            disabled={!stripe || processing}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 px-12 rounded-lg shadow-sm hover:shadow transition-colors disabled:opacity-50 min-w-[160px]"
                        >
                            Pay Now
                        </button>
                    </div>
                </form>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="w-full md:w-[380px] bg-[#f8f9fb] p-8 border-l border-gray-100 flex flex-col h-full rounded-r-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-8">Order Summary</h3>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center mb-6 pb-6 border-b border-gray-200 last:border-0 last:pb-2">
                            <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center shrink-0 p-2 overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                                ) : (
                                    <div className="w-8 h-8 opacity-20 bg-blue-500 rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{item.name}</h4>
                                <p className="text-[11px] text-gray-400 mb-1">{item.subtitle || 'Standard'}</p>
                                <p className="text-[11px] text-gray-400">Quantity : {item.quantity || 1}</p>
                            </div>
                            <div className="font-bold text-gray-800">{formatCurrency(item.price)}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Subtotal</span>
                        <span className="text-gray-700 font-semibold">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Shipping</span>
                        <span className="text-gray-700 font-semibold">{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Taxes</span>
                        <span className="text-gray-700 font-semibold">{formatCurrency(0)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <span className="text-base font-bold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e5e7eb;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default StripePaymentForm;
