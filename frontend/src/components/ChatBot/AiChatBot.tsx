import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2, Zap, MessageSquare, Menu, X, User, MessageSquareText, RefreshCw, Layers, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import nexa_img from "../../assets/nexa.png"
import axiosInstance from '@/service/axiosInstance';
import { useNexaChat } from '@/context/NexaChatContext';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { LeadFormModal } from '../LeadFormModal';

// --- Types ---
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    size?: string;
    variant?: string;
    className?: string;
    title?: string;
}

interface MessageBubbleProps {
    sender: 'User' | 'Nexa';
    text: string;
    timestamp: string;
}

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    handleSend: (e: React.FormEvent) => void;
    isLoading: boolean;
}

interface ChatMessagesProps {
    messages: Array<{ id: number; sender: 'User' | 'Nexa'; text: string; timestamp: string }>;
    isLoading: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    nexa_img: string;
}

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
    handleNewChat: () => void;
    handlePromptClick: (prompt: string) => void;
    isLoading: boolean;
    nexa_img: string;
}

interface HeaderProps {
    setIsSidebarOpen: (value: boolean) => void;
}

// --- Custom Button Component ---
const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, type = 'button', size, variant = 'primary', className = '', title }) => {
    let baseClasses = "flex items-center justify-center font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] focus:ring-4 focus:ring-offset-2 focus:ring-primary/50 relative z-10";
    if (size === 'icon') baseClasses += " h-11 w-11 p-2";
    else if (size === 'lg') baseClasses += " h-14 px-7 py-3 text-lg";
    else baseClasses += " h-10 px-5 py-2 text-sm";

    if (variant === 'primary') baseClasses += " bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50 shadow-lg shadow-primary/30 hover:shadow-xl";
    else if (variant === 'ghost') baseClasses += " bg-transparent text-foreground hover:bg-muted";
    else if (variant === 'outline') baseClasses += " border border-border/50 text-foreground hover:bg-muted/50 shadow-sm";

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
            title={title}
        >
            {children}
        </motion.button>
    );
};

// --- Memoized Message Bubble Component ---
const MessageBubble = memo<MessageBubbleProps>(({ sender, text, timestamp }) => {
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const isUser = sender === 'User';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} group mb-2`}
        >
            <div className={`flex items-end max-w-[95%] sm:max-w-[80%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full shadow-lg flex items-center justify-center flex-shrink-0 mb-1 ${isUser ? 'ml-3 bg-muted ring-2 ring-white/10' : 'mr-3 bg-white p-0.5 ring-1 ring-border/50'}`}>
                    {isUser ? (
                        <User className="w-5 h-5 text-muted-foreground" />
                    ) : (
                        <img src={nexa_img} alt="Nexa" className="w-full h-full rounded-full object-cover" />
                    )}
                </div>

                <div className={`relative px-5 py-3.5 md:p-5 rounded-2xl shadow-sm transition-all duration-300 ${isUser
                    ? 'bg-gradient-to-br from-primary to-green-600 text-white rounded-br-none shadow-lg shadow-primary/20'
                    : 'bg-card text-foreground rounded-tl-none border border-border/40 shadow-md hover:shadow-lg'
                    }`}>
                    <p className={`whitespace-pre-wrap text-[15px] leading-relaxed ${isUser ? 'text-white/95 font-medium' : 'text-foreground/90'}`} dangerouslySetInnerHTML={{ __html: formattedText }} />
                    <span className={`text-[10px] uppercase tracking-wider font-semibold mt-2 block opacity-70 ${isUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {timestamp}
                    </span>
                </div>
            </div>
        </motion.div>
    );
});


// --- Component for the Input Bar and Footer (Dynamic Part) ---
const ChatInput = memo<ChatInputProps>(({ input, setInput, handleSend, isLoading }) => {
    return (
        <footer className="flex-shrink-0 p-4 pb-6 md:p-6 border-t border-border/40 bg-background/80 backdrop-blur-xl relative z-20">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-end gap-2 p-1.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300">
                <textarea
                    rows={1}
                    placeholder="Ask about courses, fees, or policies..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            handleSend(e);
                        }
                    }}
                    className="flex-1 w-full pl-5 py-3.5 pr-14 bg-transparent border-none focus:ring-0 text-[15px] md:text-base text-foreground resize-none overflow-y-auto max-h-32 min-h-[52px] placeholder:text-muted-foreground/60"
                    disabled={isLoading}
                    style={{ scrollbarWidth: 'none' }} // Hide scrollbar for cleaner look
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 bottom-2 h-10 w-10 rounded-full flex-shrink-0 mb-0.5 bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-600 shadow-lg shadow-primary/25 border-none dark:text-white"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
                </Button>
            </form>
            <p className="text-center text-[10px] text-muted-foreground/50 mt-3 font-medium tracking-wide">
                Nexa can make mistakes. Consider checking important information.
            </p>
        </footer>
    );
});


// --- Component for the Message Body (Only renders on new messages) ---
const ChatMessages = memo<ChatMessagesProps>(({ messages, isLoading, messagesEndRef, nexa_img }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-transparent custom-scrollbar-thin relative z-10 scroll-smooth">
            <AnimatePresence>
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        sender={msg.sender}
                        text={msg.text}
                        timestamp={msg.timestamp}
                    />
                ))}
            </AnimatePresence>

            {isLoading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-start"
                >
                    <div className="flex items-center max-w-[90%] md:max-w-[70%] flex-row">
                        <img
                            src={nexa_img}
                            alt="Nexa"
                            className="w-8 h-8 rounded-full object-cover mr-3 shadow-md border-2 border-primary/50 p-0.5"
                        />
                        <div className="p-3 px-4 rounded-3xl bg-card text-foreground rounded-tl-none border border-border flex items-center gap-3 shadow-lg">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <p className="text-sm font-medium text-muted-foreground animate-pulse">Thinking...</p>
                        </div>
                    </div>
                </motion.div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
});


const FullPageAIChatbot = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { messages, setMessages, clearMessages } = useNexaChat();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [hasSubmittedLead, setHasSubmittedLead] = useState(false);
    const messagesEndRef = useRef(null);

    // Check localStorage on mount and show lead form if not submitted
    useEffect(() => {
        const leadCaptured = localStorage.getItem('nexaLeadCaptured');
        if (leadCaptured === 'true') {
            setHasSubmittedLead(true);
        } else {
            // Show lead form on page load if not captured yet
            setShowLeadForm(true);
        }
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);


    const handleSend = useCallback(async (e: React.FormEvent) => {
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
                text: "⚠️ **Connection Error**: I failed to reach the server. Please try again.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, setMessages]);

    const handleNewChat = useCallback(() => {
        clearMessages();
        setInput('');
        setIsLoading(false);
        setIsSidebarOpen(false);
    }, [clearMessages]);

    const sendUserMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;
        const userMessage = {
            id: Date.now(),
            sender: 'User' as const,
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const data = { message: text };
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
                text: "⚠️ **Connection Error**: I failed to reach the server. Please try again.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, setMessages]);

    const handlePromptClick = useCallback((prompt: string) => {
        sendUserMessage(prompt);
    }, [sendUserMessage]);


    return (
        <>
            <Navbar />
            <div className="fixed inset-0 flex transition-all duration-300 z-40 text-foreground font-sans overflow-hidden bg-background pt-16">

                {/* Abstract Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"
                    />
                </div>

                {/* Sidebar */}
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    handleNewChat={handleNewChat}
                    handlePromptClick={handlePromptClick}
                    isLoading={isLoading}
                    nexa_img={nexa_img}
                />

                {/* Main Chat Area */}
                <div className={`flex-1 flex flex-col transition-all duration-500 ease-spring relative z-10 ${isSidebarOpen ? 'opacity-50 md:opacity-100' : 'opacity-100'}`}>

                    {isSidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

                    <Header setIsSidebarOpen={setIsSidebarOpen} />

                    <ChatMessages
                        messages={messages}
                        isLoading={isLoading}
                        messagesEndRef={messagesEndRef}
                        nexa_img={nexa_img}
                    />

                    <ChatInput
                        input={input}
                        setInput={setInput}
                        handleSend={handleSend}
                        isLoading={isLoading}
                    />
                </div>

                <style>{`
                    .custom-scrollbar-thin::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar-thin::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar-thin::-webkit-scrollbar-thumb {
                        background: rgba(156, 163, 175, 0.5);
                        border-radius: 10px;
                    }
                    .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
                        background: rgba(156, 163, 175, 0.8);
                    }
                `}</style>
            </div>

            {/* Lead Form Modal */}
            <LeadFormModal
                open={showLeadForm}
                onOpenChange={setShowLeadForm}
                onSuccess={() => {
                    setHasSubmittedLead(true);
                }}
            />

            <Footer />
        </>
    );
};

// --- Memoized Header Component ---
const Header = memo<HeaderProps>(({ setIsSidebarOpen }) => {
    const navigate = useNavigate();
    return (
        <header className="flex items-center justify-between p-4 md:px-8 bg-background/80 border-b border-border shadow-sm flex-shrink-0 backdrop-blur-md relative z-20">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-foreground hover:bg-muted"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-foreground hover:bg-muted mr-2"
                    onClick={() => navigate('/nexa')}
                    title="Back to Nexa Home"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-extrabold text-foreground flex items-center tracking-tight">
                        <MessageSquare className="h-6 w-6 text-primary mr-3 hidden md:block" />
                        Nexa AI
                    </h1>
                    <p className="hidden md:block text-xs text-muted-foreground font-medium">Your Personal Learning Assistant</p>
                </div>

            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-700 font-semibold flex items-center gap-2 border border-green-500/30">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                Online
            </span>
        </header>
    );
});

// --- Memoized Sidebar Component ---
const Sidebar = memo<SidebarProps>(({ isSidebarOpen, setIsSidebarOpen, handleNewChat, handlePromptClick, isLoading, nexa_img }) => {
    const recommendedPrompts = [
        "What are the most popular courses?",
        "How do I get my certificate?",
        "Do you offer career guidance?",
    ];

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-72 md:w-80 bg-background/95 border-r border-border/50 p-6 flex-shrink-0 flex flex-col transition-transform duration-300 md:translate-x-0 md:relative md:inset-auto backdrop-blur-xl shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <div className="flex items-center justify-between mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-foreground hover:bg-muted -ml-2"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <X className="h-6 w-6" />
                </Button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="fill-current w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg">Nexa Menu</span>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-primary hover:text-white transition-colors border-primary/20"
                    onClick={handleNewChat}
                    disabled={isLoading}
                    title="New Chat"
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <div className="mb-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="space-y-2">
                    {recommendedPrompts.map((prompt, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-left p-3 rounded-xl bg-card hover:bg-primary/5 border border-border/50 hover:border-primary/30 transition-all text-sm text-foreground/80 hover:text-primary flex items-center gap-3 group"
                            onClick={() => handlePromptClick(prompt)}
                            disabled={isLoading}
                        >
                            <MessageSquareText className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
                            {prompt}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-border/50">
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                    <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                        <Layers className="w-4 h-4" />
                        Knowledge Base
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Nexa is trained on the latest course material and policies.
                    </p>
                </div>
            </div>
        </div>
    );
});

export default FullPageAIChatbot;