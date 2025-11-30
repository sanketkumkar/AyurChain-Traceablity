import React, { createContext, useState, useContext, ReactNode } from 'react';
import { en } from '../lib/i18n/en';
import { hi } from '../lib/i18n/hi';

type Language = 'en' | 'hi';

const translations = { en, hi };

// Helper function to get nested values from an object using a dot-notation string
const getNestedTranslation = (language: Language, key: string): string | undefined => {
  return key.split('.').reduce((obj, k) => {
    return obj && typeof obj === 'object' && k in obj ? (obj as any)[k] : undefined;
  }, translations[language] as any);
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, replacements: Record<string, string> = {}): string => {
    let translation = getNestedTranslation(language, key);
    if (translation === undefined) {
      console.warn(`Translation key '${key}' not found for language '${language}'. Falling back to English.`);
      translation = getNestedTranslation('en', key);
    }

    if (translation === undefined) {
      return key; // Return the key itself if not found in English either
    }

    // Replace placeholders like {name}
    Object.keys(replacements).forEach(placeholder => {
      translation = translation!.replace(`{${placeholder}}`, replacements[placeholder]);
    });

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
