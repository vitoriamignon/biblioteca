
import React from "react";

type CardProps = {
  children?: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return <div className={`bg-card text-card-foreground rounded-lg border border-border shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <div className={`p-4 border-b border-border ${className}`}>{children}</div>;
}

export function CardTitle({ children }: { children?: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-card-foreground">{children}</h3>;
}

export function CardDescription({ children }: { children?: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardProps) {
  return <div className={`p-4 border-t border-border ${className}`}>{children}</div>;
}
