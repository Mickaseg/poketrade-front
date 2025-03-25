import { useEffect, useId } from "react";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    btnStyle = "error",
    modalId,
}) => {
    // Génération d'un ID unique pour chaque instance de modal
    const uniqueId = useId();
    // Utilisation de l'ID fourni ou de l'ID unique généré
    const dialogId = modalId || `confirmation_modal_${uniqueId}`;

    // Utilisation de useEffect pour gérer l'ouverture/fermeture de la modal
    useEffect(() => {
        const modal = document.getElementById(dialogId);
        if (isOpen && modal) {
            modal.showModal();
        } else if (modal) {
            modal.close();
        }
    }, [isOpen, dialogId]);

    return (
        <dialog id={dialogId} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button className="btn btn-outline mr-2" onClick={onClose}>
                        Annuler
                    </button>
                    <button
                        className={`btn btn-${btnStyle}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmationModal;
