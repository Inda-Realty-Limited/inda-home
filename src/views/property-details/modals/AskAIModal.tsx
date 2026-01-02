import { useState } from "react";
import { X, Send, Sparkles, MessageCircle } from "lucide-react";

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
}

const suggestedQuestions = [
  "What are the neighborhood crime statistics?",
  "Can I customize the interior finishes?",
  "What's the resale history of similar properties?",
  "Are there any upcoming developments nearby?",
  "What's the maintenance cost breakdown?",
  "Can I visit the property before purchasing?"
];

export function AskAIModal({ isOpen, onClose, propertyName }: AskAIModalProps) {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{ type: "user" | "ai"; message: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (questionText: string) => {
    if (!questionText.trim()) return;

    // Add user question
    setConversation((prev) => [...prev, { type: "user", message: questionText }]);
    setQuestion("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = `Based on the property data for ${propertyName}, I can help with that. This is a simulated AI response. In a production environment, this would connect to a real AI service that has been trained on property data, market trends, and legal information to provide accurate, helpful answers to your specific questions.`;
      
      setConversation((prev) => [...prev, { type: "ai", message: response }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-2xl md:rounded-xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[80vh]">
        {/* Header */}
        <div className="bg-[#50b8b1] text-white p-4 md:rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <div>
              <h3 className="text-white">Ask AI Anything</h3>
              <p className="text-sm text-white/90">Get instant answers about this property</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e8f5f4] rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-[#50b8b1]" />
              </div>
              <h4 className="text-gray-900 mb-2">What would you like to know?</h4>
              <p className="text-sm text-gray-600 mb-6">
                Ask me anything about this property, the area, or the buying process
              </p>
              
              {/* Suggested Questions */}
              <div className="text-left">
                <p className="text-sm text-gray-600 mb-3">Try asking:</p>
                <div className="space-y-2">
                  {suggestedQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubmit(q)}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-[#e8f5f4] rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-[#50b8b1] text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.type === "ai" && (
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                        <span className="text-xs text-gray-600">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(question);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="px-6 py-3 bg-[#50b8b1] text-white rounded-lg hover:bg-[#45a69f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
