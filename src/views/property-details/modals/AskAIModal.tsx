import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, MessageCircle, AlertCircle } from "lucide-react";
import { AiService, ChatMessage, PropertyChatContext } from "@/api/ai";

interface PropertyData {
  id: string;
  name: string;
  location: string;
  price: string;
  priceNumeric: number;
  bedrooms: number;
  scannedData?: {
    bathrooms?: number | null;
    propertyType?: string | null;
    features?: string[];
  };
}

interface PropertyIntelligenceData {
  property_details?: any;
  location_intelligence?: any;
  investment_analysis?: any;
  value_projection?: any;
  cash_flow_forecast?: any;
}

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyData?: PropertyData;
  intelligenceData?: PropertyIntelligenceData;
}

const suggestedQuestions = [
  "Is this property priced fairly compared to the area?",
  "What's the expected ROI on this property?",
  "What schools and hospitals are nearby?",
  "How long would it take to get to Victoria Island?",
  "What are the total costs including all fees?",
  "What could this property be worth in 5 years?",
];

export function AskAIModal({
  isOpen,
  onClose,
  propertyName,
  propertyData,
  intelligenceData
}: AskAIModalProps) {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{ type: "user" | "ai"; message: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Reset conversation when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Keep conversation for when modal reopens
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const buildPropertyContext = (): PropertyChatContext => {
    return {
      id: propertyData?.id || "unknown",
      name: propertyData?.name || propertyName,
      location: propertyData?.location || "Unknown",
      price: propertyData?.priceNumeric || 0,
      propertyType: propertyData?.scannedData?.propertyType || undefined,
      bedrooms: propertyData?.bedrooms,
      bathrooms: propertyData?.scannedData?.bathrooms || undefined,
      features: propertyData?.scannedData?.features?.join(", ") || undefined,
      intelligenceData: intelligenceData,
    };
  };

  const buildConversationHistory = (): ChatMessage[] => {
    return conversation.map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.message,
    }));
  };

  const handleSubmit = async (questionText: string) => {
    if (!questionText.trim() || isLoading) return;

    setError(null);

    // Add user question to conversation
    setConversation((prev) => [...prev, { type: "user", message: questionText }]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await AiService.chatAboutProperty({
        question: questionText,
        propertyContext: buildPropertyContext(),
        conversationHistory: buildConversationHistory(),
      });

      if (response.success && response.response) {
        setConversation((prev) => [...prev, { type: "ai", message: response.response! }]);
      } else {
        setError(response.error || "Failed to get response");
        // Add error message to conversation
        setConversation((prev) => [
          ...prev,
          { type: "ai", message: "I'm sorry, I couldn't process your question. Please try again." },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError("Something went wrong. Please try again.");
      setConversation((prev) => [
        ...prev,
        { type: "ai", message: "I'm sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = () => {
    setConversation([]);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-2xl md:rounded-xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[80vh]">
        {/* Header */}
        <div className="bg-[#50b8b1] text-white p-4 md:rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Ask AI Anything</h3>
              <p className="text-sm text-white/90">Get instant answers about this property</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {conversation.length > 0 && (
              <button
                onClick={handleClearConversation}
                className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e8f5f4] rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-[#50b8b1]" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">What would you like to know?</h4>
              <p className="text-sm text-gray-600 mb-6">
                Ask me anything about this property, the area, or the investment potential
              </p>

              {/* Property Context Indicator */}
              {intelligenceData && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full mb-6">
                  <Sparkles className="w-3 h-3" />
                  Full property intelligence available
                </div>
              )}

              {/* Suggested Questions */}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600 mb-3">Try asking:</p>
                <div className="space-y-2">
                  {suggestedQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubmit(q)}
                      disabled={isLoading}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-[#e8f5f4] rounded-lg text-sm text-gray-700 transition-colors disabled:opacity-50"
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
                    className={`max-w-[85%] px-4 py-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-[#50b8b1] text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.type === "ai" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                        <span className="text-xs font-medium text-gray-500">INDA AI</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                      <span className="text-xs font-medium text-gray-500">INDA AI</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
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
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50b8b1] focus:border-transparent disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="px-6 py-3 bg-[#50b8b1] text-white rounded-lg hover:bg-[#45a69f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI responses are based on available property data. Always verify important details.
          </p>
        </div>
      </div>
    </div>
  );
}
