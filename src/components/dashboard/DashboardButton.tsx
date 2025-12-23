import React from "react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type ButtonVariant = "primary" | "secondary" | "raw";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    className?: string;
}

export default function DashboardButton({
    children,
    variant = "primary",
    className = "",
    ...props
}: ButtonProps) {

    if (variant === "raw") {
        return (
            <button className={className} {...props}>
                {children}
            </button>
        );
    }

    const baseStyles = "px-4 py-2 rounded font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = variant === "primary"
        ? "bg-inda-teal text-inda-white hover:bg-opacity-90 hover:shadow-md active:scale-[0.98]"
        : "bg-inda-gray text-inda-dark hover:bg-inda-teal hover:text-inda-white";

    return (
        <button
            className={cn(baseStyles, variantStyles, className)}
            {...props}
        >
            {children}
        </button>
    );
}
