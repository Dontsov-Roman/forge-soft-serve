import { useCallback, useEffect, useState } from "react";

export const useSimpleTimeout = (defaultOpenTimeout = 3000) => {
    const [enabled, setEnabled] = useState(false);
    let timeOut: number = 0;
    
    const onClick = useCallback(() => {
        setEnabled(true);
        timeOut = setTimeout(() => { setEnabled(false); }, defaultOpenTimeout);
    }, [timeOut, defaultOpenTimeout, setEnabled]);

    useEffect(() => {
        return () => clearTimeout(timeOut);
    }, []);
    
    return { enabled, onClick };
};