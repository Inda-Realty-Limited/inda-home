/**
 * AI Service
 * Handles AI-powered features like property Q&A
 */

import apiClient from "./index";

// ============================================================================
// TYPES
// ============================================================================

export interface PropertyChatContext {
  id: string;
  name: string;
  location: string;
  price: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  features?: string;
  intelligenceData?: {
    property_details?: any;
    location_intelligence?: any;
    investment_analysis?: any;
    value_projection?: any;
    cash_flow_forecast?: any;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PropertyChatRequest {
  question: string;
  propertyContext: PropertyChatContext;
  conversationHistory?: ChatMessage[];
}

export interface PropertyChatResponse {
  success: boolean;
  response?: string;
  error?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export const AiService = {
  /**
   * Chat about a specific property
   * Sends question + property context to AI for contextual answers
   */
  chatAboutProperty: async (request: PropertyChatRequest): Promise<PropertyChatResponse> => {
    try {
      const response = await apiClient.post<PropertyChatResponse>(
        "/api/ai/chat/property",
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("AI chat error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to get AI response. Please try again.",
      };
    }
  },
};

export default AiService;
