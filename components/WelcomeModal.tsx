import React from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <Card className="max-w-2xl w-full animate-fade-in-up">
        <h2 className="text-2xl font-bold text-brand-green-dark mb-4">{t('welcomeModal.title')}</h2>
        <div className="space-y-4 text-gray-700">
            <p>
                {t('welcomeModal.intro')}
            </p>
            <p>
                <strong>{t('welcomeModal.howItWorks')}</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><span className="font-semibold">{t('welcomeModal.step1').split(': ')[0]}:</span> {t('welcomeModal.step1').split(': ')[1]}</li>
                <li><span className="font-semibold">{t('welcomeModal.step2').split(': ')[0]}:</span> {t('welcomeModal.step2').split(': ')[1]}</li>
                <li><span className="font-semibold">{t('welcomeModal.step3').split(': ')[0]}:</span> {t('welcomeModal.step3').split(': ')[1]}</li>
                <li><span className="font-semibold">{t('welcomeModal.step4').split(': ')[0]}:</span> {t('welcomeModal.step4').split(': ')[1]}</li>
            </ul>
             <p className="text-sm text-gray-500 pt-2">
                {t('welcomeModal.disclaimer')}
            </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>{t('welcomeModal.startButton')}</Button>
        </div>
      </Card>
    </div>
  );
};
