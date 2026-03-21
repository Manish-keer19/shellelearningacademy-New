import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, X, Maximize2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import nexa_img from "../../assets/nexa.png";
import axiosInstance from '@/service/axiosInstance';
import { useNexaChat } from '@/context/NexaChatContext';
import { LeadFormModal } from '../LeadFormModal';

const FloatingNexaChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [hasSubmittedLead, setHasSubmittedLead] = useState(false);
    const { messages, setMessages } = useNexaChat();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the chat container
    const navigate = useNavigate();
    const location = useLocation();

    // Check localStorage on mount
    useEffect(() => {
        const leadCaptured = localStorage.getItem('nexaLeadCaptured');
        if (leadCaptured === 'true') {
            setHasSubmittedLead(true);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click is outside the chat container
            if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const messageText = input.trim();
        const userMessage = {
            id: Date.now(),
            sender: 'User' as const,
            text: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const data = { message: messageText };
            const response = await axiosInstance.post("/bot", data);
            const aiResponseText = response.data.reply;

            const aiMessage = {
                id: Date.now() + 1,
                sender: 'Nexa' as const,
                text: aiResponseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages((prev) => [...prev, aiMessage]);

        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                sender: 'Nexa' as const,
                text: "⚠️ Connection Error. Please try again.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMaximize = () => {
        navigate('/nexa-bot');
        setIsOpen(false); // Close the floating chat when navigating
    };

    // Hide floating chat if on the full-page bot route
    // IMPORTANT: This must be after all hooks to prevent "React Hook ordering" errors
    if (location.pathname === '/nexa-bot') {
        return null;
    }

    return (
        <div
            ref={chatContainerRef}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] font-sans flex flex-col items-end gap-4"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-[90vw] sm:w-96 bg-background/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[70vh] md:h-[500px] max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 p-0.5">
                                        <img src={nexa_img} alt="Nexa" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full animate-pulse is-online"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-wide text-white">Nexa Assistant</h3>
                                    <p className="text-[10px] text-white/80 font-medium">Always here to help</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleMaximize}
                                    className="p-2 rounded-full transition-colors"
                                    title="Maximize"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/50 to-background/80 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm backdrop-blur-sm ${msg.sender === 'User'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-card/80 border border-white/10 text-foreground rounded-tl-none'
                                            }`}
                                    >
                                        <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                        <span className={`text-[9px] block mt-1.5 opacity-70 ${msg.sender === 'User' ? 'text-white' : 'text-muted-foreground'}`}>
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-card/50 border border-white/10 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-xs text-muted-foreground animate-pulse">Nexa is typing...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 bg-background/90 backdrop-blur-md border-t border-white/10">
                            <div className="relative flex items-center group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your question..."
                                    className="w-full pl-4 pr-12 py-3.5 bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm transition-all shadow-inner"
                                    disabled={isLoading}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    <Send className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                onClick={() => {
                    if (!hasSubmittedLead) {
                        setShowLeadForm(true);
                    } else {
                        setIsOpen(!isOpen);
                    }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 overflow-hidden relative group ${isOpen ? 'bg-destructive ring-4 ring-destructive/20' : 'bg-primary ring-4 ring-primary/20'}`}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-7 h-7 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full p-0.5"
                        >
                            <img src={nexa_img} alt="Chat" className="w-full h-full rounded-full object-cover" />
                            {/* Online indicator ping */}
                            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-background"></span>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Lead Form Modal */}
            <LeadFormModal
                open={showLeadForm}
                onOpenChange={setShowLeadForm}
                onSuccess={() => {
                    setHasSubmittedLead(true);
                    setIsOpen(true);
                }}
            />
        </div>
    );
};

export default FloatingNexaChat;
