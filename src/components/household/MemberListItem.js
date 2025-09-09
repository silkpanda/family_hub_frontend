import React from 'react';

/**
 * MemberListItem Component
 * Displays information for a single household member with edit and delete buttons.
 * @param {object} props
 * @param {object} props.member - The member object to display.
 * @param {function} props.onEdit - Function to call when the edit button is clicked.
 * @param {function} props.onDelete - Function to call when the delete button is clicked.
 */
const MemberListItem = ({ member, onEdit, onDelete }) => {
    return (
        <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
                <img 
                    src={member.image || `https://placehold.co/64x64/E2E8F0/4A5568?text=${member.displayName.charAt(0)}`} 
                    alt={member.displayName} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/E2E8F0/4A5568?text=??'; }}
                />
                <div>
                    <p className="font-bold text-gray-800">{member.displayName}</p>
                    <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <button 
                    onClick={() => onEdit(member)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                    Edit
                </button>
                <button 
                    onClick={() => onDelete(member._id)}
                    className="text-sm font-semibold text-red-600 hover:text-red-800"
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

export default MemberListItem;
