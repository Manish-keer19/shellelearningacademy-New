import { Card } from "../NexaUi/card";
import { Bot, User } from "lucide-react";

const messages = [
  {
    type: "user",
    text: "Hi Nexa! I'm struggling with understanding Python loops. Can you help?",
  },
  {
    type: "bot",
    text: "Of course! Python loops are used to iterate over sequences. There are two main types:\n\n• **for loops**: Iterate over a sequence (list, tuple, string)\n• **while loops**: Execute while a condition is True\n\nWould you like me to show you some examples?",
  },
  {
    type: "user",
    text: "Yes please! Show me a for loop example.",
  },
  {
    type: "bot",
    text: "Here's a simple example:\n\n```python\nfor i in range(5):\n    print(f\"Count: {i}\")\n```\n\nThis will print numbers 0 through 4. The `range(5)` function generates numbers from 0 to 4.",
  },
];

const ChatPreviewSection = () => {
  return (
    <section className="section-padding bg-green-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-100/50 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-100/50 rounded-full blur-2xl" />

      <div className="container-main relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            Live Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See <span className="text-gradient">Nexa.AI</span> in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience how natural and helpful conversations with Nexa.AI can be.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card variant="chat" className="overflow-hidden">
            {/* Chat header */}
            <div className="bg-gradient-cta px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Nexa.AI</h4>
                <p className="text-sm text-foreground/70">Online • Ready to help</p>
              </div>
              <div className="ml-auto flex gap-1">
                <span className="w-2 h-2 rounded-full bg-foreground/30" />
                <span className="w-2 h-2 rounded-full bg-foreground/30" />
                <span className="w-2 h-2 rounded-full bg-foreground/30" />
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-6 space-y-4 bg-background max-h-[400px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.type === "user"
                        ? "bg-green-100"
                        : "bg-green-400"
                      }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-green-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.type === "user"
                        ? "bg-green-400 text-foreground rounded-br-md"
                        : "bg-green-50 border border-green-100 rounded-bl-md"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div className="px-6 py-4 border-t border-green-100 bg-background">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all"
                />
                <button className="w-12 h-12 rounded-xl bg-gradient-cta flex items-center justify-center shadow-card hover:shadow-glow transition-all">
                  <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ChatPreviewSection;
