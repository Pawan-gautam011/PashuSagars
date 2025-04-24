import React from 'react';

const ThemeProvider = ({ children }) => {
  return (
    <div className="font-sans text-gray-800">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
        
        :root {
          --primary-dark: #004d40;
          --primary-light: #00695c;
          --accent: #55DD4A;
          --accent-light: #ADE1B0;
          --text-dark: #1a202c;
          --text-light: #718096;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', sans-serif;
        }
       
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes fall {
          from { transform: translateY(-100px); opacity: 0; }
          to { transform: translateY(calc(100vh + 100px)); opacity: 0.2; }
        }
      `}</style>
      {children}
    </div>
  );
};

export default ThemeProvider;