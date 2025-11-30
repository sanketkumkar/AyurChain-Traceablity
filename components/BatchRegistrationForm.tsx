import React, { useState, useCallback, useEffect } from 'react';
import { CollectionData } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { Spinner } from './common/Spinner';
import { HerbInfo, getHerbInfo } from '../services/geminiService';
import { FormError } from './common/FormError';
import { useLanguage } from '../contexts/LanguageContext';

interface BatchRegistrationFormProps {
  onSubmit: (data: Omit<CollectionData, 'collectionDate'>) => void;
  onBack: () => void;
}

const HerbInfoCard: React.FC<{ info: HerbInfo }> = ({ info }) => {
    const { t } = useLanguage();
    return (
        <div className="mt-4 p-4 bg-brand-cream-light border border-brand-green-light rounded-lg">
            <p className="font-semibold text-brand-green-dark">{t('batchRegistration.herbInfoAbout')}</p>
            <p className="text-sm text-gray-700 mt-1">{info.description}</p>
            <p className="font-semibold text-brand-green-dark mt-3">{t('batchRegistration.herbInfoProperties')}</p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                {info.ayurvedicProperties.map((prop, i) => <li key={i}>{prop}</li>)}
            </ul>
        </div>
    )
};


export const BatchRegistrationForm: React.FC<BatchRegistrationFormProps> = ({ onSubmit, onBack }) => {
  const [herbName, setHerbName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [collector, setCollector] = useState('');
  const { location, loading: geoLoading, error: geoError, getLocation } = useGeolocation();
  
  const [herbInfo, setHerbInfo] = useState<HerbInfo | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLanguage();

  useEffect(() => {
    if (herbName.length < 3) {
        setHerbInfo(null);
        return;
    }
    const handler = setTimeout(() => {
      setInfoLoading(true);
      getHerbInfo(herbName).then(info => {
        setHerbInfo(info);
        setInfoLoading(false);
      });
    }, 1000); // Debounce for 1 second

    return () => {
      clearTimeout(handler);
    };
  }, [herbName]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!herbName.trim()) newErrors.herbName = 'batchRegistration.errorHerbName';
    if (!collector.trim()) newErrors.collector = 'batchRegistration.errorCollector';
    
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
        newErrors.quantity = 'batchRegistration.errorQuantity';
    }

    if (!location) newErrors.location = 'batchRegistration.errorLocation';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      herbName: herbName.trim(),
      quantity: parseFloat(quantity),
      collector: collector.trim(),
      location: location!,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-green-dark mb-6">{t('batchRegistration.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Input id="herbName" label={t('batchRegistration.herbNameLabel')} value={herbName} onChange={e => setHerbName(e.target.value)} required />
            <FormError message={errors.herbName ? t(errors.herbName) : undefined} />
            {infoLoading && <div className="text-sm text-gray-500">{t('batchRegistration.herbInfoLoading')}</div>}
            {herbInfo && <HerbInfoCard info={herbInfo} />}
        </div>
        <div>
            <Input id="quantity" label={t('batchRegistration.quantityLabel')} type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} required />
            <FormError message={errors.quantity ? t(errors.quantity) : undefined} />
        </div>
        <div>
            <Input id="collector" label={t('batchRegistration.collectorLabel')} value={collector} onChange={e => setCollector(e.target.value)} required />
            <FormError message={errors.collector ? t(errors.collector) : undefined} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('batchRegistration.locationLabel')}</label>
          <div className="flex items-center space-x-4">
             <Button type="button" onClick={getLocation} disabled={geoLoading}>
                {geoLoading ? <Spinner /> : t('batchRegistration.getLocationButton')}
             </Button>
            <div className="text-sm">
              {location && <span className="text-green-600 font-semibold">{t('batchRegistration.locationCaptured')} ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})</span>}
              {geoError && <span className="text-red-600">{geoError}</span>}
            </div>
          </div>
          <FormError message={errors.location ? t(errors.location) : undefined} />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onBack}>{t('batchRegistration.cancelButton')}</Button>
          <Button type="submit">{t('batchRegistration.submitButton')}</Button>
        </div>
      </form>
    </Card>
  );
};
