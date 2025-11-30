import React from 'react';
import { Button } from './common/Button';
import { IconButton } from './common/IconButton';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './common/LanguageSwitcher';

interface HeaderProps {
  currentUser: string;
  onLogout: () => void;
  onScanRequest: () => void;
  isConsumer?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onScanRequest, isConsumer = false }) => {
  const { t } = useLanguage();

  return (
    <header className="bg-brand-green shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-cream-light" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v12a1 1 0 11-2 0V3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-white ml-3">{t('header.title')}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {!isConsumer && (
              <IconButton onClick={onScanRequest} label={t('header.scanQr')} className="text-white hover:bg-brand-green-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                  </svg>
              </IconButton>
            )}
            <span className="text-white hidden sm:block">{t('header.welcome')}, <span className="font-semibold">{currentUser}</span></span>
            <Button onClick={onLogout} variant="secondary">{t('header.logout')}</Button>
          </div>
        </div>
      </div>
    </header>
  );
};
