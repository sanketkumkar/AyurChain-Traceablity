
import { useState, useCallback } from 'react';
import { GeoLocation } from '../types';

interface GeolocationState {
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prevState => ({ ...prevState, error: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setState({ location: null, loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          location: null,
          loading: false,
          error: error.message,
        });
      }
    );
  }, []);

  return { ...state, getLocation };
};
