import React from 'react';
import { HerbBatch, FinalProduct } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { IconButton } from './common/IconButton';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  batches: HerbBatch[];
  products: FinalProduct[];
  onRegisterBatch: () => void;
  onFormulateProduct: () => void;
  onViewTrace: (item: HerbBatch | FinalProduct) => void;
  onProcessBatch: (batchId: string) => void;
  onViewSmartLabel: (item: HerbBatch | FinalProduct) => void;
  onShowQrCode: (item: HerbBatch | FinalProduct) => void;
}

const SmartLabelButton: React.FC<{onClick: () => void}> = ({ onClick }) => {
    const { t } = useLanguage();
    return (
        <button onClick={onClick} className="flex items-center space-x-2 text-sm text-brand-green hover:text-brand-green-dark font-semibold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h1v1H4V4zm2 0h1v1H6V4zm2 0h1v1H8V4zm2 0h1v1h-1V4zm4 0h1v1h-1V4zm2 0h1v1h-1V4zm2 0h1v1h-1V4zM4 6h1v1H4V6zm2 0h1v1H6V6zm10 0h1v1h-1V6zm2 0h1v1h-1V6zm2 0h1v1h-1V6zM4 8h1v1H4V8zm2 0h1v1H6V8zm10 0h1v1h-1V8zm2 0h1v1h-1V8zm2 0h1v1h-1V8zM4 10h1v1H4v-1zm2 0h1v1H6v-1zm10 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zM4 14h1v1H4v-1zm2 0h1v1H6v-1zm2 0h1v1H8v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zM4 16h1v1H4v-1zm2 0h1v1H6v-1zm2 0h1v1H8v-1zm2 0h1v1h-1v-1zm6 0h1v1h-1v-1zm2 0h1v1h-1v-1zM4 18h1v1H4v-1zm2 0h1v1H6v-1zm2 0h1v1H8v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1z" />
            </svg>
            <span>{t('dashboard.viewSmartLabel')}</span>
        </button>
    )
};


export const Dashboard: React.FC<DashboardProps> = ({ batches, products, onRegisterBatch, onFormulateProduct, onViewTrace, onProcessBatch, onViewSmartLabel, onShowQrCode }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-green-dark mb-4 md:mb-0">{t('dashboard.title')}</h2>
          <div className="flex space-x-4">
            <Button onClick={onRegisterBatch}>{t('dashboard.registerBatchButton')}</Button>
            <Button onClick={onFormulateProduct} variant="secondary" disabled={batches.length === 0}>
              {t('dashboard.formulateProductButton')}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h3 className="text-xl font-semibold mb-4 text-brand-green-dark">{t('dashboard.batchesTitle')}</h3>
          <div className="space-y-4">
            {batches.length > 0 ? (
              batches.map(batch => (
                <Card key={batch.id} className="hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-brand-green">{batch.herbName}</p>
                      <p className="text-sm text-gray-500">{t('dashboard.batchId')}: {batch.id}</p>
                      <p className="text-sm text-gray-600">{t('dashboard.batchStatus')}: <span className="font-semibold">{batch.status}</span></p>
                      <p className="text-sm text-gray-600">{t('dashboard.batchOwner')}: <span className="font-semibold">{batch.currentOwner}</span></p>
                    </div>
                    <div className="flex flex-col space-y-2 items-end">
                      <Button onClick={() => onViewTrace(batch)} variant="secondary" className="px-3 py-1 text-sm">{t('dashboard.viewTraceButton')}</Button>
                       <Button onClick={() => onProcessBatch(batch.id)} className="px-3 py-1 text-sm">{t('dashboard.processButton')}</Button>
                    </div>
                  </div>
                   <div className="border-t pt-3 flex justify-end items-center space-x-4">
                       <IconButton onClick={() => onShowQrCode(batch)} label={t('dashboard.showQrButton')}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6.5 6.5l-1.5-1.5M4 12H2m15.5 6.5l-1.5-1.5M12 20v-1m6-15h-2M5.5 5.5l1.5 1.5M12 6V5" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 10h.01M7 13h.01M10 7h.01M10 10h.01M10 13h.01M13 7h.01M13 10h.01M13 13h.01M16 7h.01M16 10h.01M16 13h.01" />
                          </svg>
                       </IconButton>
                       <SmartLabelButton onClick={() => onViewSmartLabel(batch)} />
                   </div>
                </Card>
              ))
            ) : (
              <Card className="text-center text-gray-500">{t('dashboard.noBatches')}</Card>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 text-brand-green-dark">{t('dashboard.productsTitle')}</h3>
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map(product => (
                <Card key={product.id} className="hover:shadow-xl transition-shadow">
                   <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-brand-green">{product.productName}</p>
                      <p className="text-sm text-gray-500">{t('dashboard.batchId')}: {product.id}</p>
                      <p className="text-sm text-gray-600">{t('dashboard.productManufacturer')}: <span className="font-semibold">{product.manufacturer}</span></p>
                    </div>
                     <Button onClick={() => onViewTrace(product)} variant="secondary" className="px-3 py-1 text-sm">{t('dashboard.viewTraceButton')}</Button>
                  </div>
                  <div className="border-t pt-3 flex justify-end items-center space-x-4">
                    <IconButton onClick={() => onShowQrCode(product)} label={t('dashboard.showQrButton')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6.5 6.5l-1.5-1.5M4 12H2m15.5 6.5l-1.5-1.5M12 20v-1m6-15h-2M5.5 5.5l1.5 1.5M12 6V5" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 10h.01M7 13h.01M10 7h.01M10 10h.01M10 13h.01M13 7h.01M13 10h.01M13 13h.01M16 7h.01M16 10h.01M16 13h.01" />
                        </svg>
                    </IconButton>
                    <SmartLabelButton onClick={() => onViewSmartLabel(product)} />
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center text-gray-500">{t('dashboard.noProducts')}</Card>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
