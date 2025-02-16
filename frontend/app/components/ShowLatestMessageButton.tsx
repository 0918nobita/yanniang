import { AnimatePresence, motion } from "framer-motion";

type Props = {
    isVisible: boolean;
    scrollToBottom: () => void;
};

export const ShowLatestMessageButton: React.FC<Props> = ({
    isVisible,
    scrollToBottom,
}) => (
    <AnimatePresence>
        {isVisible && (
            <motion.button
                type="button"
                className="sticky bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-cyan-800 text-white rounded-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, animation: "ease-in-out" }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={scrollToBottom}
            >
                最新のメッセージを表示
            </motion.button>
        )}
    </AnimatePresence>
);
