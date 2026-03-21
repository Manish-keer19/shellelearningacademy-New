import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
    id: number;
    sender: 'User' | 'Nexa';
    text: string;
    timestamp: string;
}

interface NexaChatContextType {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    addMessage: (message: Message) => void;
    clearMessages: () => void;
}

const NexaChatContext = createContext<NexaChatContextType | undefined>(undefined);

export const useNexaChat = () => {
    const context = useContext(NexaChatContext);
    if (!context) {
        throw new Error('useNexaChat must be used within a NexaChatProvider');
    }
    return context;
};

interface NexaChatProviderProps {
    children: ReactNode;
}

export const NexaChatProvider: React.FC<NexaChatProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'Nexa',
            text: "Hi! I'm **Nexa**. How can I help you today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
    ]);

    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    const clearMessages = () => {
        setMessages([
            {
                id: Date.now(),
                sender: 'Nexa',
                text: "Hi! I'm **Nexa**. How can I help you today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
        ]);
    };

    return (
        <NexaChatContext.Provider value={{ messages, setMessages, addMessage, clearMessages }}>
            {children}
        </NexaChatContext.Provider>
    );
};
