import React from 'react';

/**
 * A reusable button component with different visual variants.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content of the button (e.g., text, icon).
 * @param {Function} props.onClick - The function to call when the button is clicked.
 * @param {string} [props.variant='primary'] - The style variant ('primary', 'secondary', 'danger', 'success', 'link', 'dangerLink').
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {string} [props.className=''] - Additional CSS classes to apply.
 * @param {string} [props.type='button'] - The button's type attribute.
 */
const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '', type = 'button' }) => {
    // Base styles for all buttons for consistent padding, font, and transitions.
    const baseStyles = 'font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    // Style definitions for each button variant.
    const variantStyles = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        success: 'bg-green-500 hover:bg-green-600 text-white',
        // Link variants have different base padding and no background.
        link: 'text-sm font-semibold text-blue-600 hover:text-blue-800 p-0 bg-transparent',
        dangerLink: 'text-sm font-semibold text-red-600 hover:text-red-800 p-0 bg-transparent',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={combinedClassName}
        >
            {children}
        </button>
    );
};

export default Button;
