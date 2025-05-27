import { useState } from 'react';
import { Link } from 'react-router-dom';

function FormCard({ title, description, icon, path, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
    return (
    <div 
      className="bg-app-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-app-border hover:border-[var(--color-primary)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 flex-1">        <div className="flex items-center justify-between mb-4">
          <div className={`text-4xl p-3 rounded-md ${isHovered ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-gray-800 text-gray-400'} transition-all`}>
            {icon}
          </div>
          <div className={`h-2 w-2 rounded-md ${isHovered ? 'bg-[var(--color-primary)]' : 'bg-gray-700'}`}></div>
        </div>
        <h3 className={`text-xl font-bold mb-2 transition-colors ${isHovered ? 'text-[var(--color-primary)]' : 'text-white'}`}>
          {title}
        </h3>
        <p className="text-gray-400 mb-4">
          {description}
        </p>
      </div>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => onSelect({ title, path })}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
            isHovered 
              ? 'bg-[var(--color-primary)] text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Selecionar
        </button>
      </div>
    </div>
  );
}

export default FormCard;
