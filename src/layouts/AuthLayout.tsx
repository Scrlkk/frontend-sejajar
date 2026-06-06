import React from 'react';

/**
 * AuthLayout provides a centered card with a glass‑morphic background using Tailwind CSS.
 */
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,hsl(210,30%,20%),hsl(210,30%,15%))]">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full shadow-2xl text-white">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;