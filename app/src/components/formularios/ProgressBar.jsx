import React from 'react';

function ProgressBar({ currentStep, steps }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = currentStep >= step.number;
          const isLastCompleted = currentStep > step.number;
          
          return (
            <React.Fragment key={step.number}>
              {/* Conexão entre os passos */}
              {index > 0 && (
                <div className={`flex-1 h-1 ${isActive ? 'bg-[var(--color-primary)]' : 'bg-gray-700'}`}></div>
              )}
              
              {/* Círculo do passo */}
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    transition-all duration-300
                    ${isActive 
                      ? 'bg-[var(--color-primary)] text-black' 
                      : 'bg-gray-800 text-gray-400 border border-gray-700'}
                  `}
                >
                  {isLastCompleted ? '✓' : step.number}
                </div>
                <span className={`mt-2 text-sm ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;
