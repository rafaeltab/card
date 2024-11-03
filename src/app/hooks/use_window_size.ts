import { useEffect, useState } from "react";

export function useWindowSize() {
    const [
        windowSize,
        setWindowSize
    ] = useState<{ width: number, height: number }>({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        function setSize() {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }

        window.addEventListener('resize', setSize);
        return () => {
            window.removeEventListener('resize', setSize);
        };
    });

    return windowSize;
}
