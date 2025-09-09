import React from 'react';

const ColorPickerModal = ({ isOpen, onClose, onColorSelect, memberName }) => {
    if (!isOpen) return null;

    // A curated palette of colors, similar to Google Calendar's options
    const colors = [
        '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
        '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
        '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#000000'
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs mx-auto" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">Choose a color for {memberName}</h3>
                <div className="grid grid-cols-5 gap-3">
                    {colors.map(color => (
                        <button
                            key={color}
                            onClick={() => onColorSelect(color)}
                            className="w-10 h-10 rounded-full transition-transform transform hover:scale-110"
                            style={{ backgroundColor: color }}
                            aria-label={`Select color ${color}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColorPickerModal;
