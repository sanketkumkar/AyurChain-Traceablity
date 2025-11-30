// At the top of the file, to inform TypeScript about the global library from the CDN script
declare var Html5Qrcode: any;

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onCancel: () => void;
  cancelButtonText?: string;
}

// Configuration function for the scanner's viewfinder box.
const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
    const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
    const qrboxSize = Math.floor(minEdge * 0.75); // Use 75% of the smaller dimension
    return {
        width: qrboxSize,
        height: qrboxSize,
    };
};

export const Scanner: React.FC<ScannerProps> = ({ onScanSuccess, onCancel, cancelButtonText }) => {
  const scannerRef = useRef<any>(null);
  const successCallbackRef = useRef(onScanSuccess);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useLanguage();

  const finalCancelButtonText = cancelButtonText || t('scanner.cancelButton');

  // Keep the callback ref up-to-date with the latest onScanSuccess function prop
  // without causing the scanner to re-initialize.
  useEffect(() => {
    successCallbackRef.current = onScanSuccess;
  }, [onScanSuccess]);

  // This effect runs only once on mount to initialize and start the scanner.
  useEffect(() => {
    const html5QrcodeScanner = new Html5Qrcode("reader-container");
    scannerRef.current = html5QrcodeScanner;

    const startScanner = () => {
        if (html5QrcodeScanner && !html5QrcodeScanner.isScanning) {
            html5QrcodeScanner.start(
                { facingMode: "environment" }, // Prioritize the rear camera
                {
                    fps: 10,
                    qrbox: qrboxFunction,
                },
                (decodedText: string, decodedResult: any) => {
                    // This callback is triggered on a successful scan.
                    // Use the ref to call the latest version of the callback.
                    successCallbackRef.current(decodedText);
                },
                (errorMessage: string) => {
                    // This callback is for scan errors, which we can ignore.
                }
            ).catch((err: any) => {
                 console.error("Scanner start error:", err);
                 setErrorMessage(t('scanner.cameraError', { error: err.message }));
            });
        }
    };
    
    startScanner();

    // Cleanup function to stop the scanner when the component unmounts.
    return () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().catch((err: any) => {
                console.error("Failed to stop scanner cleanly:", err);
            });
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once.

  return (
    <div className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="relative w-full max-w-lg h-auto aspect-square bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <div id="reader-container" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[75%] h-[75%] border-4 border-white border-dashed rounded-lg opacity-50"/>
            </div>
            <p className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-lg font-semibold">
                {t('scanner.title')}
            </p>
        </div>

        {errorMessage && <p className="text-white text-center p-4 bg-red-800 bg-opacity-70 mt-4 rounded-lg max-w-lg">{errorMessage}</p>}
        
        <div className="mt-8">
             <Button onClick={onCancel} variant="danger">{finalCancelButtonText}</Button>
        </div>
    </div>
  );
};
