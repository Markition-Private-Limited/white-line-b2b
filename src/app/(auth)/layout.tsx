import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 w-full bg-auth-bg text-foreground flex flex-col h-full overflow-y-auto">
      {children}
    </div>
  );
}
