import React, { useState } from 'react';
import { HerbBatch, ProcessingData } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { FormError } from './common/FormError';
import { useLanguage } from '../contexts/LanguageContext';

interface ProcessingFormProps {
  batch: HerbBatch;
  onSubmit: (data: Omit<ProcessingData, 'processDate'>) => void;
  onBack: () => void;
}

export const ProcessingForm: React.FC<ProcessingFormProps> = ({ batch, onSubmit, onBack }) => {
  const [processor, setProcessor] = useState('');
  const [processType, setProcessType] = useState('');
  const [outputQuantity, setOutputQuantity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLanguage();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!processor.trim()) newErrors.processor = 'processing.errorProcessor';
    if (!processType.trim()) newErrors.processType = 'processing.errorProcessType';

    const qty = parseFloat(outputQuantity);
    if (isNaN(qty) || qty <= 0) {
        newErrors.outputQuantity = 'processing.errorOutputQuantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      processor: processor.trim(),
      processType: processType.trim(),
      outputQuantity: parseFloat(outputQuantity),
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-green-dark mb-2">{t('processing.title')}</h2>
      <p className="text-lg text-gray-600 mb-6">
        {t('processing.herbInfo')}: <span className="font-semibold text-brand-green">{batch.herbName}</span> (ID: {batch.id})
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input id="processor" label={t('processing.processorLabel')} value={processor} onChange={e => setProcessor(e.target.value)} required />
          <FormError message={errors.processor ? t(errors.processor) : undefined} />
        </div>
        <div>
          <Input id="processType" label={t('processing.processTypeLabel')} value={processType} onChange={e => setProcessType(e.target.value)} required />
          <FormError message={errors.processType ? t(errors.processType) : undefined} />
        </div>
        <div>
          <Input id="outputQuantity" label={t('processing.outputQuantityLabel')} type="number" step="0.01" value={outputQuantity} onChange={e => setOutputQuantity(e.target.value)} required />
          <FormError message={errors.outputQuantity ? t(errors.outputQuantity) : undefined} />
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onBack}>{t('processing.cancelButton')}</Button>
          <Button type="submit">{t('processing.submitButton')}</Button>
        </div>
      </form>
    </Card>
  );
};
