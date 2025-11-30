import React from 'react';
import { HerbBatch, FinalProduct, Block, TransactionType, CollectionData, UserRole } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { useLanguage } from '../contexts/LanguageContext';

interface SmartLabelViewerProps {
  item: HerbBatch | FinalProduct;
  chain: Block[];
  onBack: () => void;
  userRole: UserRole;
}

const InfoPill: React.FC<{ title: string, content: string, icon: string }> = ({ title, content, icon }) => (
    <div className="flex items-center space-x-3 bg-brand-cream-light p-3 rounded-lg">
        <span className="text-2xl">{icon}</span>
        <div>
            <p className="text-xs font-semibold text-gray-500">{title}</p>
            <p className="text-md font-bold text-brand-green-dark">{content}</p>
        </div>
    </div>
);

export const SmartLabelViewer: React.FC<SmartLabelViewerProps> = ({ item, chain, onBack, userRole }) => {
    const { t } = useLanguage();
    const isProduct = 'productName' in item;
    const historyBlocks = chain.filter(block => item.history.includes(block.id)).sort((a, b) => a.timestamp - b.timestamp);
    const collectionBlock = historyBlocks.find(b => b.transaction.type === TransactionType.COLLECTION);
    const collectionData = collectionBlock?.transaction.data as CollectionData | undefined;

    const backButtonText = userRole === UserRole.CONSUMER ? t('smartLabel.backToScan') : t('smartLabel.backButton');
    const collectorBio = t('smartLabel.collectorBio', {
        collector: collectionData?.collector || 'N/A',
        herb: collectionData?.herbName || 'herbs'
    });

    const getTimeline = () => {
        return historyBlocks
        .filter(b => b.transaction.type !== TransactionType.GENESIS)
        .map(b => ({ type: t(`transactionTypes.${b.transaction.type}` as any), date: new Date(b.timestamp).toLocaleDateString() }));
    };

  return (
    <div className="max-w-4xl mx-auto font-sans">
        <div className="p-6 md:p-8 bg-brand-green rounded-t-xl text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{isProduct ? item.productName : item.herbName}</h2>
                <Button onClick={onBack} variant="secondary">{backButtonText}</Button>
            </div>
            <div className="flex items-center space-x-3 bg-brand-green-dark p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-semibold text-lg">{t('smartLabel.verified')}</p>
            </div>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-b-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
                {/* Provenance */}
                <section>
                    <h3 className="text-xl font-bold text-brand-green-dark mb-4 border-b-2 border-brand-green-light pb-2">{t('smartLabel.provenanceTitle')}</h3>
                    <div className="space-y-4">
                        {collectionData && (
                            <Card className="bg-gray-50">
                                <h4 className="font-bold text-brand-green">{t('smartLabel.harvestLocationTitle')}</h4>
                                <p className="text-gray-600 mb-3">{t('smartLabel.harvestLocationSubtitle')}</p>
                                <div className="flex items-center space-x-4">
                                    <span className="text-3xl">📍</span>
                                    <div>
                                        <p className="font-semibold">{collectionData.location.lat.toFixed(5)}, {collectionData.location.lon.toFixed(5)}</p>
                                        <a 
                                            href={`https://www.openstreetmap.org/?mlat=${collectionData.location.lat}&mlon=${collectionData.location.lon}#map=15/${collectionData.location.lat}/${collectionData.location.lon}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm text-brand-brown hover:underline font-semibold"
                                        >
                                            {t('smartLabel.viewOnMap')}
                                        </a>
                                    </div>
                                </div>
                            </Card>
                        )}
                        <Card className="bg-gray-50">
                            <h4 className="font-bold text-brand-green">{t('smartLabel.timelineTitle')}</h4>
                            <ul className="mt-2 space-y-1">
                                {getTimeline().map((event, i) => (
                                    <li key={i} className="flex items-center space-x-2">
                                        <span className="text-green-500">✓</span>
                                        <span className="font-semibold text-gray-700">{event.type}:</span>
                                        <span className="text-gray-500">{event.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </section>
                {/* Quality Assurance */}
                <section>
                    <h3 className="text-xl font-bold text-brand-green-dark mb-4 border-b-2 border-brand-green-light pb-2">{t('smartLabel.qualityTitle')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoPill title={t('smartLabel.coa')} content={t('smartLabel.coaValue')} icon="🔬" />
                        <InfoPill title={t('smartLabel.pesticide')} content={t('smartLabel.pesticideValue')} icon="🛡️" />
                        <InfoPill title={t('smartLabel.sustainability')} content={t('smartLabel.sustainabilityValue')} icon="🌍" />
                        <InfoPill title={t('smartLabel.fairTrade')} content={t('smartLabel.fairTradeValue')} icon="🤝" />
                    </div>
                     <p className="text-xs text-gray-400 mt-3">{t('smartLabel.simulatedNote')}</p>
                </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                <Card>
                    <h4 className="font-bold text-brand-green-dark mb-3 text-lg">{t('smartLabel.collectorTitle')}</h4>
                    <img src={`https://i.pravatar.cc/150?u=${collectionData?.collector}`} alt="Collector" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-brand-green-light" />
                    <p className="text-center font-bold text-xl text-brand-green-dark">{collectionData?.collector || 'N/A'}</p>
                    <p className="text-center text-sm text-gray-500">{t('smartLabel.collectorRole')}</p>
                    <p className="text-sm text-gray-600 mt-4 text-center italic">
                       {collectorBio}
                    </p>
                </Card>
            </div>
        </div>
    </div>
  );
};
