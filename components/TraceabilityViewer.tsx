import React from 'react';
import { HerbBatch, FinalProduct, Block, TransactionType, CollectionData, ProcessingData, FormulationData } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { useLanguage } from '../contexts/LanguageContext';

interface TraceabilityViewerProps {
  item: HerbBatch | FinalProduct;
  chain: Block[];
  allBatches: HerbBatch[];
  onBack: () => void;
}

const getBlockIcon = (type: TransactionType) => {
    switch (type) {
        case TransactionType.COLLECTION:
            return '🌿'; // Leaf
        case TransactionType.PROCESSING:
            return '🔬'; // Microscope
        case TransactionType.FORMULATION:
            return '⚗️'; // Alembic
        case TransactionType.GENESIS:
            return '🌍'; // Globe
        default:
            return '📦'; // Package
    }
}

const BlockDetails: React.FC<{ block: Block }> = ({ block }) => {
    const { transaction } = block;
    const { t } = useLanguage();
    
    const renderData = () => {
        switch (transaction.type) {
            case TransactionType.COLLECTION:
                const d = transaction.data as CollectionData;
                return <>
                    <p><strong>{t('traceViewer.herb')}:</strong> {d.herbName}</p>
                    <p><strong>{t('traceViewer.quantity')}:</strong> {d.quantity} kg</p>
                    <p><strong>{t('traceViewer.collector')}:</strong> {d.collector}</p>
                    <p><strong>{t('traceViewer.location')}:</strong> {d.location.lat.toFixed(4)}, {d.location.lon.toFixed(4)}</p>
                </>;
            case TransactionType.PROCESSING:
                const p = transaction.data as ProcessingData;
                return <>
                    <p><strong>{t('traceViewer.processor')}:</strong> {p.processor}</p>
                    <p><strong>{t('traceViewer.process')}:</strong> {p.processType}</p>
                    <p><strong>{t('traceViewer.output')}:</strong> {p.outputQuantity} kg</p>
                </>;
            case TransactionType.FORMULATION:
                const f = transaction.data as FormulationData;
                return <>
                    <p><strong>{t('traceViewer.productName')}:</strong> {f.productName}</p>
                    <p><strong>{t('traceViewer.manufacturer')}:</strong> {f.manufacturer}</p>
                    <p><strong>{t('traceViewer.inputBatches')}:</strong> {f.inputBatchIds.join(', ')}</p>
                </>;
            default:
                return <p>Genesis Block</p>;
        }
    }

    return (
        <div className="text-sm">
            {renderData()}
            <p className="mt-2 text-xs text-gray-500">
                <strong>{t('traceViewer.timestamp')}:</strong> {new Date(block.timestamp).toLocaleString()}
            </p>
        </div>
    );
};


export const TraceabilityViewer: React.FC<TraceabilityViewerProps> = ({ item, chain, allBatches, onBack }) => {
  const { t } = useLanguage();
  const isProduct = 'productName' in item;
  const historyBlocks = chain.filter(block => item.history.includes(block.id)).sort((a, b) => a.timestamp - b.timestamp);

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-brand-green-dark">{t('traceViewer.title')}</h2>
            <p className="text-lg text-gray-700">{isProduct ? item.productName : item.herbName}</p>
        </div>
        <Button onClick={onBack} variant="secondary">{t('traceViewer.backButton')}</Button>
      </div>
      
      <div className="flow-root">
        <ul className="-mb-8">
          {historyBlocks.map((block, index) => (
            <li key={block.id}>
              <div className="relative pb-8">
                {index !== historyBlocks.length - 1 && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-brand-green-light flex items-center justify-center ring-8 ring-white text-xl">
                      {getBlockIcon(block.transaction.type)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {t(`transactionTypes.${block.transaction.type}` as any)} <span className="font-medium text-gray-900">({block.id})</span>
                      </p>
                       <div className="mt-2">
                            <BlockDetails block={block} />
                        </div>
                    </div>
                    <div className="text-right text-xs whitespace-nowrap text-gray-500 break-all pl-4">
                        <p><strong>{t('traceViewer.hash')}:</strong> <span className="font-mono text-brand-green-dark">{block.hash.substring(0, 16)}...</span></p>
                        <p><strong>{t('traceViewer.prevHash')}:</strong> <span className="font-mono text-brand-brown">{block.previousHash.substring(0, 16)}...</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </Card>
  );
};
