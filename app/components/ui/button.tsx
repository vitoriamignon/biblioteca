
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "destructive" | "ghost" | "secondary" | string;
  children?: React.ReactNode;
};

export function Button({ children, variant, className = "", ...props }: ButtonProps) {
  const base = "px-3 py-1 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants: Record<string, string> = {
    outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground text-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "hover:bg-accent hover:text-accent-foreground text-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  
  const defaultStyle = "bg-primary text-primary-foreground hover:bg-primary/90";
  
  return (
    <button 
      className={`${base} ${variants[variant ?? ""] || defaultStyle} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
