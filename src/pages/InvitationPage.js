// Import the React library, which is necessary for creating React components.
import React from 'react';

// Import the child components that will be used on this page.
// CreateInvitation handles the logic for generating a new household invite code.
import CreateInvitation from '../components/invite/CreateInvitation';
// JoinHousehold handles the logic for a user joining a household with an invite code.
import JoinHousehold from '../components/invite/JoinHousehold';

/**
 * InvitationPage Component
 * This component serves as a container for the invitation-related functionalities.
 * It displays two main components side-by-side: one for creating invitations 
 * and another for joining a household with an existing code.
 * * @param {object} props - The properties passed to the component.
 * @param {string} props.householdId - The ID of the current household, passed to CreateInvitation.
 * @param {function} props.onJoinSuccess - A callback function passed to JoinHousehold to be executed after a successful join.
 * @returns {JSX.Element} The rendered InvitationPage component.
 */
const InvitationPage = ({ householdId, onJoinSuccess }) => {
    // The component returns a JSX structure that defines the layout.
    return (
        // A container div that centers the content and creates a responsive grid.
        // On small screens (mobile), the components will stack vertically.
        // On medium screens and larger, they will appear in two columns.
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The component for creating a new invitation. */}
            {/* It requires the 'householdId' to know which household to generate the code for. */}
            <CreateInvitation householdId={householdId} />
            
            {/* The component for joining an existing household. */}
            {/* It takes the 'onJoinSuccess' callback to notify the parent component when a user has joined. */}
            <JoinHousehold onJoinSuccess={onJoinSuccess} />

        </div>
    );
};

// Export the InvitationPage component as the default export from this file,
// so it can be imported and used in other parts of the application.
export default InvitationPage;

