import React from "react";

const ErrorPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 overflow-hidden">
      {/* Animated Gradient Blob */}
      <div className="absolute -z-10 top-1/2 left-1/2 w-[32rem] h-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 opacity-60 blur-3xl animate-blob" />
      {/* Broken Barbell Image with floating animation */}
      <img
        src="/WtNaRfy01.svg"
        alt="Broken Barbell"
        className="mb-6 w-48 h-48 animate-float"
      />
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center animate-fadein">
        Oops! Something went wrong.
      </h1>
      <p className="text-gray-500 text-center max-w-xs mb-6 animate-fadein delay-200">
        It looks like this page is broken. Please try again later.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition animate-fadein delay-400"
      >
        Go Home
      </a>
      {/* Custom keyframes for animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 2.5s ease-in-out infinite;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 1s cubic-bezier(0.4,0,0.2,1) both;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes blob {
          0%,100% { transform: scale(1) translate(-50%,-50%); }
          33% { transform: scale(1.05,0.95) translate(-50%,-50%); }
          66% { transform: scale(0.95,1.05) translate(-50%,-50%); }
        }
        .animate-blob {
          animation: blob 8s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
