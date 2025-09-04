// path: src/components/ui/CustomSelect.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

// Le type pour chaque option dans notre menu déroulant
type Option = {
  value: string;
  label: string;
};

// Les props que notre composant acceptera
interface CustomSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Une icône de chevron simple faite en SVG pour éviter d'ajouter des dépendances
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export default function CustomSelect({ options, value, onChange, placeholder = 'Sélectionner...' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Gère la fermeture du menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={ref} className="relative w-full min-w-[200px]">
      {/* Le bouton principal qui affiche la valeur sélectionnée */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm text-brand-dark shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-dark/50"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {/* Le panneau des options qui s'affiche ou se masque avec une transition */}
      <div
        className={`absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg transition-all duration-200 ease-out ${
          isOpen ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
        }`}
        style={{ transformOrigin: 'top center' }}
      >
        <ul className="py-1">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 text-sm text-brand-dark transition-colors ${
                option.value === value
                  ? 'bg-brand-light font-semibold'
                  : 'hover:bg-brand-light'
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}