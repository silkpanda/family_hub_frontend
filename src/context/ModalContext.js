import React, { createContext, useState } from 'react';
import PinModal from '../components/ui/PinModal';
import AddEditMemberModal from '../components/household/AddEditMemberModal';
import AddEditTaskModal from '../components/tasks/AddEditTaskModal';
import AddEditEventModal from '../components/calendar/AddEditEventModal';
import ColorPickerModal from '../components/household/ColorPickerModal';
import AddEditRewardModal from '../components/rewards/AddEditRewardModal';
import AddEditRecipeModal from '../components/meal-planner/AddEditRecipeModal';
import AddEditRestaurantModal from '../components/meal-planner/AddEditRestaurantModal'; // Import the new modal
import ConfirmationModal from '../components/ui/ConfirmationModal';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState(null);

    const showModal = (modalType, modalProps = {}) => {
        setModal({ type: modalType, props: modalProps });
    };

    const hideModal = () => setModal(null);

    const renderModal = () => {
        if (!modal) return null;
        const { type, props } = modal;
        switch (type) {
            case 'pin':
                return <PinModal {...props} isOpen={true} onClose={hideModal} />;
            case 'confirmation':
                return <ConfirmationModal {...props} isOpen={true} onClose={hideModal} />;
            case 'addEditMember':
                return <AddEditMemberModal {...props} isOpen={true} onClose={hideModal} />;
            case 'addEditTask':
                return <AddEditTaskModal {...props} isOpen={true} onClose={hideModal} />;
            case 'addEditEvent':
                return <AddEditEventModal {...props} isOpen={true} onClose={hideModal} />;
            case 'colorPicker':
                return <ColorPickerModal {...props} isOpen={true} onClose={hideModal} />;
            case 'addEditReward':
                return <AddEditRewardModal {...props} isOpen={true} onClose={hideModal} />;
            case 'addEditRecipe':
                return <AddEditRecipeModal {...props} isOpen={true} onClose={hideModal} />;
            case 'addEditRestaurant':
                return <AddEditRestaurantModal {...props} isOpen={true} onClose={hideModal} />;
            default:
                return null;
        }
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {renderModal()}
        </ModalContext.Provider>
    );
};