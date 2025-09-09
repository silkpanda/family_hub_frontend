import React from 'react';

/**
 * A simple layout component that wraps each page's content.
 * It provides a consistent, large title and standard padding for the page.
 * @param {object} props - The component props.
 * @param {string} props.title - The title to display at the top of the page.
 * @param {React.ReactNode} props.children - The content of the page.
 */
const PageWrapper = ({ title, children }) => {
    return (
        <div className="p-6 md:p-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">{title}</h1>
            <div>{children}</div>
        </div>
    );
};

export default PageWrapper;
