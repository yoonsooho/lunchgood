import { useState, useEffect, useMemo, memo } from "react";

interface ILocation {
  latitude: number;
  longitude: number;
}

const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;

    setLocation({
      latitude,
      longitude,
    });
  };

  const handleError = (err: GeolocationPositionError) => {
    setError(err.message);
  };

  const memoizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, memoizedOptions);
  }, [memoizedOptions]);

  return { location, error };
};

export { useGeoLocation };
