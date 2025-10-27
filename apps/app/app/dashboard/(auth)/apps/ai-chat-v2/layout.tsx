import React from "react";

/**
 * Layout independiente para AI-Chat V2 sin sidebar del dashboard
 */
export default function AIChatLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full">
      {children}
    </div>
  );
}
