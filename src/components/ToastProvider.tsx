import React, { createContext, useContext, useRef, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";

export type ToastType = "info" | "success" | "error" | "warning";

export type ToastContextType = {
  showToast: (msg: string, duration?: number, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ICONS: Record<
  ToastType,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  info: {
    icon: <FiInfo />,
    color: "#fafafa", // inda-white
    bg: "#54a6a6", // inda-teal
  },
  success: {
    icon: <FiCheckCircle />,
    color: "#fafafa", // inda-white
    bg: "#54a6a6", // inda-teal
  },
  error: {
    icon: <FiXCircle />,
    color: "#fafafa", // inda-white
    bg: "#FD4B2D",
  },
  warning: {
    icon: <FiAlertTriangle />,
    color: "#101820", // inda-dark
    bg: "#f3f1a0", // inda-yellow
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (
    msg: string,
    duration = 2000,
    toastType: ToastType = "info"
  ) => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, duration + 300);
  };

  const icon = ICONS[type];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 40,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        <div
          className={`transition-all duration-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            background: icon.bg,
            color: icon.color,
            borderRadius: 16,
            padding: "10px 16px",
            minWidth: 120,
            maxWidth: 480,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 500,
            fontSize: 15,
            pointerEvents: visible ? "auto" : "none",
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          <span style={{ fontSize: 22, marginRight: 10 }}>{icon.icon}</span>
          <span style={{ flexShrink: 1, textAlign: "left" }}>{message}</span>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
