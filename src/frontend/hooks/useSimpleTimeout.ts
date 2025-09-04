import { useCallback, useEffect, useRef, useState } from "react";

export const useSimpleTimeout = (defaultOpenTimeout = 3000) => {
    const ref = useRef<number>();
    const [enabled, setEnabled] = useState(false);
    
    const onClick = useCallback(() => {
        setEnabled(true);
        clearTimeout(ref.current);
        ref.current = setTimeout(() => setEnabled(false), defaultOpenTimeout);
    }, [ref.current, defaultOpenTimeout, setEnabled]);

    useEffect(() => {
        return () => clearTimeout(ref.current);
    }, []);
    
    return { enabled, onClick };
};