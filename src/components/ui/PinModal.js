import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from './Card'; // Import Card
import Button from './Button'; // Import Button

// PinDisplay component remains the same as it's highly specific.
const PinDisplay = ({ currentPin }) => (
    <div className="flex justify-center items-center space-x-3 mb-6 h-8">
        {Array(4).fill(0).map((_, i) => (
            <div key={i} className={`w-6 h-6 rounded-full border-2 transition-colors ${currentPin.length > i ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'}`}></div>
        ))}
    </div>
);

// Numpad now uses the reusable Button component.
const Numpad = ({ onPinInput, onBackspace, onNext, onSubmit, step, isLoading, mode }) => (
    <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(item => (
            <Button key={item} onClick={() => onPinInput(item.toString())} variant="secondary" className="text-2xl font-bold p-4">
                {item}
            </Button>
        ))}
        <Button onClick={onBackspace} variant="secondary" className="text-2xl font-bold p-4">&larr;</Button>
        <Button onClick={mode === 'setup' && step === 1 ? onNext : onSubmit} disabled={isLoading} variant="primary" className="col-span-3 text-xl p-4">
            {isLoading ? '...' : (mode === 'setup' ? (step === 1 ? 'Next' : 'Save') : 'Enter')}
        </Button>
    </div>
);

const PinModal = ({ isOpen, onClose, mode = 'login' }) => {
    const { session, setPin, pinLogin } = useContext(AuthContext);
    const [pin, setPinState] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPinState('');
            setConfirmPin('');
            setStep(1);
            setError('');
            setIsLoading(false);
        }
    }, [isOpen, mode]);

    const handlePinInput = useCallback((num) => {
        if (isLoading) return;
        if (mode === 'setup') {
            if (step === 1 && pin.length < 4) setPinState(p => p + num);
            else if (step === 2 && confirmPin.length < 4) setConfirmPin(p => p + num);
        } else {
            if (pin.length < 4) setPinState(p => p + num);
        }
    }, [mode, step, pin.length, confirmPin.length, isLoading]);

    const handleBackspace = useCallback(() => {
        if (isLoading) return;
        if (mode === 'setup') {
            if (step === 1) setPinState(p => p.slice(0, -1));
            else setConfirmPin(p => p.slice(0, -1));
        } else {
            setPinState(p => p.slice(0, -1));
        }
    }, [mode, step, isLoading]);

    const handleNext = useCallback(() => {
        if (pin.length !== 4) { setError('PIN must be 4 digits.'); return; }
        setError('');
        setStep(2);
    }, [pin.length]);

    const handleSubmit = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        setError('');
        if (mode === 'setup') {
            if (pin !== confirmPin) {
                setError('PINs do not match. Please try again.');
                setPinState('');
                setConfirmPin('');
                setStep(1);
                setIsLoading(false);
                return;
            }
            const result = await setPin(pin);
            if (result === true) onClose();
            else {
                setError(result);
                setIsLoading(false);
            }
        } else {
            const success = await pinLogin(pin);
            if (success) onClose();
            else {
                setError('Incorrect PIN. Please try again.');
                setPinState('');
                setIsLoading(false);
            }
        }
    }, [pin, confirmPin, setPin, pinLogin, onClose, mode, isLoading]);

    useEffect(() => {
        if (mode === 'login' && pin.length === 4) handleSubmit();
    }, [pin, mode, handleSubmit]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key >= '0' && e.key <= '9') handlePinInput(e.key);
            else if (e.key === 'Backspace') handleBackspace();
            else if (e.key === 'Enter') {
                if (mode === 'setup' && step === 1) handleNext();
                else handleSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handlePinInput, handleBackspace, handleNext, handleSubmit, mode, step]);
     
    if (!isOpen) return null;

    const title = mode === 'setup' ? (step === 1 ? 'Create Parent PIN' : 'Confirm Your PIN') : 'Enter Parent PIN';
    const currentPin = mode === 'setup' ? (step === 1 ? pin : confirmPin) : pin;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            {/* The main container is now a Card component */}
            <Card className="p-8 text-center w-full max-w-sm mx-auto" onClick={e => e.stopPropagation()}>
                {session.user?.image && <img src={session.user.image} alt={session.user.displayName} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-200" />}
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-gray-500 mb-6 h-5">{error || `Welcome, ${session.user?.displayName}!`}</p>
                <PinDisplay currentPin={currentPin} />
                <Numpad onPinInput={handlePinInput} onBackspace={handleBackspace} onNext={handleNext} onSubmit={handleSubmit} step={step} isLoading={isLoading} mode={mode} />
            </Card>
        </div>
    );
};

export default PinModal;
