'use client';
import { useEffect, useState } from 'react'

const UseMounted = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);

        return () => {
            setIsMounted(false);
        }
    }, [])

    return isMounted;
}

export default UseMounted