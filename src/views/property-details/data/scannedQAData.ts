import { QASection } from './propertyData';

export const scannedQAData: QASection[] = [
  {
    title: "Price & Value Analysis",
    type: "price",
    questions: [
      {
        question: "What is the Fair Market Value (FMV)?",
        answer: "Based on our AI analysis of this external listing and our database, the Fair Market Value is estimated.",
      }
    ]
  },
  {
    title: "Location & Infrastructure Insights",
    questions: [
      {
        question: "What are the location advantages?",
        answer: "This location offers good connectivity, nearby amenities, and strong growth potential.",
      }
    ]
  },
  {
    title: "Financial Performance Projections",
    type: "financial",
    questions: [
      {
        question: "What is the expected ROI?",
        answer: "Projected ROI ranges from 6-8% annually based on market analysis.",
      }
    ]
  },
  {
    title: "Risk Assessment",
    type: "risk",
    questions: [
      {
        question: "What are the main risks?",
        answer: "Risk assessment based on external listing data. Independent verification recommended.",
      }
    ]
  },
  {
    title: "Exit & Liquidity Analysis",
    type: "exit",
    questions: [
      {
        question: "How liquid is this property?",
        answer: "Liquidity analysis based on market trends in the area.",
      }
    ]
  },
  {
    title: "Developer & Project Credibility",
    type: "developer",
    layer: "verification-required",
    questions: [
      {
        question: "Who is the developer?",
        answer: "Developer information from external listing. Verification required for purchase.",
      }
    ]
  },
  {
    title: "Portfolio Fit",
    type: "portfolio",
    questions: [
      {
        question: "Is this a good investment?",
        answer: "Portfolio fit analysis based on property characteristics and market position.",
      }
    ]
  }
];

