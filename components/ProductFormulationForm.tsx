import React, { useState } from 'react';
import { HerbBatch, FormulationData } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { FormError } from './common/FormError';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductFormulationFormProps {
  availableBatches: HerbBatch[];
  onSubmit: (data: Omit<FormulationData, 'formulationDate'>) => void;
  onBack: () => void;
}

export const ProductFormulationForm: React.FC<ProductFormulationFormProps> = ({ availableBatches, onSubmit, onBack }) => {
  const [productName, setProductName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLanguage();

  const handleBatchToggle = (batchId: string) => {
    setSelectedBatchIds(prev =>
      prev.includes(batchId) ? prev.filter(id => id !== batchId) : [...prev, batchId]
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!productName.trim()) newErrors.productName = 'formulation.errorProductName';
    if (!manufacturer.trim()) newErrors.manufacturer = 'formulation.errorManufacturer';
    if (selectedBatchIds.length === 0) newErrors.batches = 'formulation.errorBatches';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      productName: productName.trim(),
      manufacturer: manufacturer.trim(),
      inputBatchIds: selectedBatchIds,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-green-dark mb-6">{t('formulation.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input id="productName" label={t('formulation.productNameLabel')} value={productName} onChange={e => setProductName(e.target.value)} required />
          <FormError message={errors.productName ? t(errors.productName) : undefined} />
        </div>
        <div>
          <Input id="manufacturer" label={t('formulation.manufacturerLabel')} value={manufacturer} onChange={e => setManufacturer(e.target.value)} required />
          <FormError message={errors.manufacturer ? t(errors.manufacturer) : undefined} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('formulation.selectBatchesLabel')}</label>
          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
            {availableBatches.length > 0 ? availableBatches.map(batch => (
              <div key={batch.id} className="flex items-center space-x-3 bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  id={`batch-${batch.id}`}
                  checked={selectedBatchIds.includes(batch.id)}
                  onChange={() => handleBatchToggle(batch.id)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                />
                <label htmlFor={`batch-${batch.id}`} className="flex-grow cursor-pointer">
                  <span className="font-semibold text-gray-800">{batch.herbName}</span>
                  <span className="text-xs text-gray-500 ml-2">(ID: {batch.id})</span>
                </label>
              </div>
            )) : <p className="text-sm text-gray-500 p-2">{t('formulation.noBatchesAvailable')}</p>}
          </div>
          <FormError message={errors.batches ? t(errors.batches) : undefined} />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onBack}>{t('formulation.cancelButton')}</Button>
          <Button type="submit">{t('formulation.submitButton')}</Button>
        </div>
      </form>
    </Card>
  );
};
