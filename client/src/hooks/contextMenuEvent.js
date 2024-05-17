import { useEffect, useRef } from 'react';

const usePreventContextMenu = (callback) => {
    const elementRef = useRef();

    useEffect(() => {
        const handleContextmenu = (event) => {
            event.preventDefault(); // Prevent default right-click behavior
            if (callback) {
                callback();
            }
        };

        const currentElement = elementRef.current;
        if (currentElement) {
            currentElement.addEventListener("contextmenu", handleContextmenu);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (currentElement) {
                currentElement.removeEventListener("contextmenu", handleContextmenu);
            }
        };
    }, [callback]);

    return elementRef;
};

export default usePreventContextMenu;
