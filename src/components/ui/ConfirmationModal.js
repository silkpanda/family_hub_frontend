import React from 'react';
import Button from './Button';
import Card from './Card'; // Import Card

const ConfirmationModal = ({ isOpen, onClose, title, message, onConfirm }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            {/* The main container is now a Card component */}
            <Card className="p-8 w-full max-w-sm mx-auto text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                    <Button onClick={handleConfirm} variant="danger">Confirm</Button>
                </div>
            </Card>
        </div>
    );
};

export default ConfirmationModal;
