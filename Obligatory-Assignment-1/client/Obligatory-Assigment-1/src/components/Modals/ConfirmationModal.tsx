import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    title: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null; // Do not render if modal is not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-xs sm:max-w-sm w-full mx-auto">
                <h2 className="text-lg font-semibold mb-3 sm-mb-4">{title}</h2>
                <p className="text-sm sm:text-base mb-4">{message}</p>
                <div className="flex flex-col sm:flex-row justify-end mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
                    <button onClick={onClose} className="btn btn-gray sm:mr-2">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-primary bg-red-700">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
