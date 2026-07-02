import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/shared/Icon";

interface Props {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

// Stilizim me klasa utility të Tailwind; animacionet vijnë nga framer-motion.
const Modal = ({ open, title, onClose, children }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(20,12,6,.55)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-[420px] rounded-[18px] bg-[var(--surface)] border border-[var(--border)] p-[26px] shadow-[var(--shadow-lg)]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif m-0 text-[22px] font-semibold text-[var(--ink)]">
                {title}
              </h3>
              <button
                onClick={onClose}
                aria-label="Mbyll"
                className="rj-iconbtn grid place-items-center w-[34px] h-[34px] rounded-[9px] border border-[var(--border-2)] bg-[var(--bg)] text-[var(--ink-2)] cursor-pointer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
