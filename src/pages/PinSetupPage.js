import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

// --- FILE: /src/pages/PinSetupPage.js ---
//
// --- UPDATES ---
// 1. Moved the `PinDisplay` and `Numpad` components outside of the `PinSetupPage`
//    component. Defining components inside other components is an anti-pattern
//    that causes them to be recreated on every render, leading to unstable
//    event handlers and other bugs.
// 2. Passed all necessary functions and state down to the new standalone
//    components as props. This is the correct and stable way to structure the code.

// Standalone component for displaying the PIN dots
const PinDisplay = ({ currentPin }) => (
    <div className="flex justify-center items-center space-x-3 mb-6 h-8">
        {Array(4).fill(0).map((_, i) => (
            <div key={i} className={`w-6 h-6 rounded-full border-2 transition-colors ${currentPin.length > i ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></div>
        ))}
    </div>
);

// Standalone component for the number pad
const Numpad = ({ onPinInput, onBackspace, onNext, onSubmit, step, isLoading }) => (
    <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
            <button key={item} onClick={() => onPinInput(item.toString())} className="text-2xl font-bold p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                {item}
            </button>
        ))}
        <button onClick={onBackspace} className="text-2xl font-bold p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            &larr;
        </button>
        <button onClick={() => onPinInput('0')} className="text-2xl font-bold p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            0
        </button>
        <button 
            onClick={step === 1 ? onNext : onSubmit} 
            disabled={isLoading} 
            className="text-xl font-bold p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
        >
            {isLoading ? 'Saving...' : (step === 1 ? 'Next' : 'Save')}
        </button>
    </div>
);


const PinSetupPage = () => {
    const { session, setPin: setAuthPin } = useContext(AuthContext);
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep] = useState(1); // 1 for initial entry, 2 for confirmation
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePinInput = useCallback((num) => {
        if (step === 1 && pin.length < 4) {
            setPin(p => p + num);
        } else if (step === 2 && confirmPin.length < 4) {
            setConfirmPin(p => p + num);
        }
    }, [step, pin.length, confirmPin.length]);

    const handleBackspace = useCallback(() => {
        if (step === 1) {
            setPin(p => p.slice(0, -1));
        } else {
            setConfirmPin(p => p.slice(0, -1));
        }
    }, [step]);

    const handleNext = useCallback(() => {
        if (pin.length !== 4) {
            setError('PIN must be 4 digits.');
            return;
        }
        setError('');
        setStep(2);
    }, [pin.length]);

    const handleSubmit = useCallback(async () => {
        if (pin !== confirmPin) {
            setError('PINs do not match. Please try again.');
            setPin('');
            setConfirmPin('');
            setStep(1);
            return;
        }
        setIsLoading(true);
        setError('');
        const result = await setAuthPin(pin);
        if (result !== true) {
            setError(result); // Display error message from the context
            setIsLoading(false);
        }
    }, [pin, confirmPin, setAuthPin]);
    
    // Allow keyboard input for the PIN pad
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key >= '0' && e.key <= '9') {
                handlePinInput(e.key);
            } else if (e.key === 'Backspace') {
                handleBackspace();
            } else if (e.key === 'Enter') {
                if (step === 1) handleNext();
                else handleSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePinInput, handleBackspace, handleNext, handleSubmit, step]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md p-8 text-center">
                <img src={session.user?.image} alt={session.user?.displayName} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-200" />
                <h2 className="text-xl font-semibold text-gray-800">Welcome, {session.user?.displayName}!</h2>
                <p className="text-gray-500 mb-6">
                    {step === 1 ? 'Create a 4-digit PIN for parent access.' : 'Confirm your PIN.'}
                </p>
                
                <PinDisplay currentPin={step === 1 ? pin : confirmPin} />

                {error && <p className="text-red-500 mb-4 h-5">{error}</p>}
                
                <Numpad 
                    onPinInput={handlePinInput}
                    onBackspace={handleBackspace}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                    step={step}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default PinSetupPage;
