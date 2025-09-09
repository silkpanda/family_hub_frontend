import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * PinLoginPage Component
 * Renders a PIN pad for user authentication to elevate to "parent" session mode.
 * @param {object} props - Component props.
 * @param {object} props.user - The user object attempting to log in.
 * @param {function} props.onBack - Function to return to the Kiosk/user selection screen.
 */
const PinLoginPage = ({ user, onBack }) => {
    const { pinLogin } = useContext(AuthContext);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePinInput = useCallback((num) => {
        if (pin.length < 4) {
            setPin(prevPin => prevPin + num);
        }
    }, [pin.length]);

    const handleBackspace = () => {
        setPin(pin.slice(0, -1));
    };

    const handleSubmit = useCallback(async () => {
        if (pin.length !== 4) {
            setError('PIN must be 4 digits.');
            return;
        }
        setIsLoading(true);
        setError('');
        const success = await pinLogin(pin);
        if (!success) {
            setError('Invalid PIN. Please try again.');
            setPin(''); // Clear PIN on failure
        }
        // On success, the AuthContext will change the session mode and App.js will re-render.
        setIsLoading(false);
    }, [pin, pinLogin]);
    
    // Allow keyboard entry for the PIN for better accessibility
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key >= '0' && e.key <= '9') handlePinInput(e.key);
            else if (e.key === 'Backspace') handleBackspace();
            else if (e.key === 'Enter') handleSubmit();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePinInput, handleSubmit]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md p-8 text-center relative">
                <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
                    &larr; Back
                </button>
                <img 
                    src={user.image} 
                    alt={user.displayName} 
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/E2E8F0/4A5568?text=??'; }}
                />
                <h2 className="text-xl font-semibold text-gray-800">Welcome, {user.displayName}</h2>
                <p className="text-gray-500 mb-6">Enter your 4-digit PIN</p>

                {/* PIN indicator dots */}
                <div className="flex justify-center items-center space-x-3 mb-6 h-8">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full border-2 transition-colors ${pin.length > i ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></div>
                    ))}
                </div>

                {error && <p className="text-red-500 mb-4 h-5">{error}</p>}

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button key={num} onClick={() => handlePinInput(num.toString())} className="text-2xl font-bold p-4 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {num}
                        </button>
                    ))}
                     <button onClick={handleBackspace} className="text-2xl font-bold p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                        &larr;
                    </button>
                    <button onClick={() => handlePinInput('0')} className="text-2xl font-bold p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                        0
                    </button>
                    <button onClick={handleSubmit} disabled={isLoading} className="text-xl font-bold p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300">
                        {isLoading ? '...' : 'Go'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PinLoginPage;
