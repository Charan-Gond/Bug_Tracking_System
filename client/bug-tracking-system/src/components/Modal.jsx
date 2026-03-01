import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

const Modal = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div
                ref={modalRef}
                className={clsx(
                    "bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-lg transform transition-all",
                    "animate-in fade-in zoom-in-95 duration-200"
                )}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700/50 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
