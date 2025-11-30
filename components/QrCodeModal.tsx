// At the top of the file, to inform TypeScript about the global variable from the CDN script
declare var qrcode: any;

import React, { useMemo } from 'react';
import { HerbBatch, FinalProduct } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface QrCodeModalProps {
  item: HerbBatch | FinalProduct;
  onClose: () => void;
}

const generateQrCodeDataURL = (text: string): string => {
  try {
    const typeNumber = 4;
    const errorCorrectionLevel = 'L';
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(text);
    qr.make();
    // Creates a data URL with a scale of 10 and a margin of 5 pixels
    return qr.createDataURL(10, 5);
  } catch (e) {
    console.error("Failed to generate QR code", e);
    return "";
  }
};

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ item, onClose }) => {
  const { t } = useLanguage();
  const isProduct = 'productName' in item;

  const qrCodeValue = useMemo(() => {
    // Standardizing the QR code content as a JSON string for robust parsing
    return JSON.stringify({
      type: 'ayurchain-item',
      id: item.id,
    });
  }, [item.id]);

  const qrCodeDataUrl = useMemo(() => generateQrCodeDataURL(qrCodeValue), [qrCodeValue]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <Card className="max-w-sm w-full text-center">
        <h2 className="text-xl font-bold text-brand-green-dark mb-2">{t('qrModal.title')}</h2>
        <p className="text-gray-600 mb-4">{isProduct ? item.productName : item.herbName}</p>

        {qrCodeDataUrl ? (
          <a href={qrCodeDataUrl} download={`${item.id}-qrcode.png`}>
            <img src={qrCodeDataUrl} alt={`QR code for ${isProduct ? item.productName : item.herbName}`} className="w-64 h-64 mx-auto border-4 border-white shadow-lg rounded-lg" />
          </a>
        ) : (
          <div className="w-64 h-64 mx-auto flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-red-500">{t('qrModal.error')}</p>
          </div>
        )}
        
        <p className="text-xs text-gray-400 mt-4 break-all">ID: {item.id}</p>
        <p className="text-sm text-gray-500 mt-2">{t('qrModal.downloadHint')}</p>

        <div className="mt-6 flex justify-center">
          <Button onClick={onClose} variant="secondary">{t('qrModal.closeButton')}</Button>
        </div>
      </Card>
    </div>
  );
};
