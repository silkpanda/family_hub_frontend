import React, { useMemo } from 'react';

/**
 * ScoreboardWidget Component
 * Displays a ranked list of all household members by their point totals.
 * @param {object} props
 * @param {Array} props.members - The list of household members.
 * @param {string} props.currentMemberId - The ID of the member whose profile is being viewed.
 */
const ScoreboardWidget = ({ members, currentMemberId }) => {
    const sortedMembers = useMemo(() => {
        // Create a copy before sorting to avoid mutating the original array
        return [...members].sort((a, b) => b.points - a.points);
    }, [members]);

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Scoreboard</h3>
            <ul className="space-y-3">
                {sortedMembers.map((member, index) => (
                    <li key={member._id} className={`flex items-center justify-between p-2 rounded-md ${member._id === currentMemberId ? 'bg-indigo-100' : ''}`}>
                        <div className="flex items-center space-x-3">
                            <span className="font-bold text-gray-600 w-6 text-center">{index + 1}</span>
                            <img 
                                src={member.image || `https://placehold.co/64x64/E2E8F0/4A5568?text=${member.displayName.charAt(0)}`} 
                                alt={member.displayName} 
                                className="w-8 h-8 rounded-full" 
                            />
                            <span className="font-semibold text-gray-800">{member.displayName}</span>
                        </div>
                        <span className="font-bold text-indigo-600">{member.points} pts</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScoreboardWidget;
