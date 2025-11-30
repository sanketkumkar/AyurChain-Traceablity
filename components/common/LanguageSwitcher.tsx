import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'hi');
  };

  return (
    <div className="relative">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="appearance-none bg-brand-green-dark border border-brand-cream-light text-white text-sm rounded-md pl-3 pr-8 py-1 focus:outline-none focus:ring-2 focus:ring-brand-cream-light"
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.516 7.548c.436-.446 1.144-.446 1.58 0L10 10.434l2.904-2.886c.436-.446 1.144-.446 1.58 0 .436.446.436 1.164 0 1.61l-3.7 3.762c-.436.446-1.144.446-1.58 0L5.516 9.158c-.436-.446-.436-1.164 0-1.61z" />
        </svg>
      </div>
    </div>
  );
};
