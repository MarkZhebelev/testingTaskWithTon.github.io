'use client'
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
    isConnected: boolean;
    setIsConnected: (value: boolean) => void;
    balanceTon: number | null;
    setBalanceTon: (value: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [balanceTon, setBalanceTon] = useState<number | null>(null);

    return (
        <AppContext.Provider value={{ isConnected, setIsConnected, balanceTon, setBalanceTon}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};