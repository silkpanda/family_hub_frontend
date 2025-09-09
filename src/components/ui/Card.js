import React from 'react';

/**
 * A reusable card component with consistent styling.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the card.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the card.
 * All other props are spread onto the main div element.
 */
const Card = ({ children, className = '', ...props }) => {
    // Base styles for all cards to ensure a consistent look and feel.
    const baseStyles = 'bg-white rounded-xl shadow-md';
     
    // Combine base styles with any additional classes passed in.
    const combinedClassName = `${baseStyles} ${className}`;

    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
};

export default Card;
