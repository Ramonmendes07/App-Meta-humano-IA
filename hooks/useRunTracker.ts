import { useState, useRef, useEffect, useCallback } from 'react';
import type { RunData } from '../types';

type RunStatus = 'idle' | 'running' | 'paused' | 'finished';

const haversineDistance = (
  coords1: GeolocationCoordinates,
  coords2: GeolocationCoordinates
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const useRunTracker = () => {
  const [status, setStatus] = useState<RunStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  const [distance, setDistance] = useState<number>(0); // in km
  const [currentSpeed, setCurrentSpeed] = useState<number>(0); // in m/s
  const [elevationGain, setElevationGain] = useState<number>(0);

  const positionsRef = useRef<GeolocationCoordinates[]>([]);
  const watchIdRef = useRef<number | null>(null);
  // FIX: Changed NodeJS.Timeout to number for browser compatibility.
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'running') {
      // FIX: Use window.setInterval to ensure the return type is 'number' in browser environments.
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    };
  }, [status, startTime]);

  const handlePositionUpdate = (position: GeolocationPosition) => {
    const { coords } = position;
    setCurrentSpeed(coords.speed || 0);

    const prevPosition = positionsRef.current[positionsRef.current.length - 1];
    if (prevPosition) {
      // Distance calculation
      const newDistance = haversineDistance(prevPosition, coords);
      setDistance((d) => d + newDistance);
      
      // Elevation calculation
      if (coords.altitude && prevPosition.altitude && coords.altitude > prevPosition.altitude) {
        setElevationGain(g => g + (coords.altitude! - prevPosition.altitude!));
      }
    }
    positionsRef.current.push(coords);
  };

  const handlePositionError = (err: GeolocationPositionError) => {
    setError(`ERROR(${err.code}): ${err.message}`);
    stopTracking();
  };

  const startTracking = () => {
     if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handlePositionError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };
  
  const startRun = useCallback(() => {
    setError(null);
    setDistance(0);
    setCurrentSpeed(0);
    setElevationGain(0);
    setElapsedTime(0);
    positionsRef.current = [];
    setStartTime(Date.now());
    setStatus('running');
    startTracking();
  }, []);

  const pauseRun = useCallback(() => {
    setStatus('paused');
    stopTracking();
  }, []);

  const resumeRun = useCallback(() => {
    setStatus('running');
    setStartTime(Date.now() - elapsedTime); // Adjust start time to account for pause
    startTracking();
  }, [elapsedTime]);

  const stopRun = useCallback(() => {
    setStatus('finished');
    stopTracking();
    const finalRunData: RunData = {
        distance: parseFloat(distance.toFixed(2)),
        time: Math.round(elapsedTime / 1000),
        avgPace: distance > 0 ? (elapsedTime / 1000) / distance : 0,
        date: new Date().toISOString().split('T')[0],
        elevationGain: Math.round(elevationGain),
    };
    return finalRunData;
  }, [distance, elapsedTime, elevationGain]);

  const resetRun = useCallback(() => {
    setStatus('idle');
    setDistance(0);
    setCurrentSpeed(0);
    setElevationGain(0);
    setElapsedTime(0);
    setStartTime(0);
    positionsRef.current = [];
    setError(null);
  }, []);

  const currentPace = currentSpeed > 0.3 ? 1000 / (currentSpeed * 60) : 0; // min/km

  return {
    status,
    error,
    distance,
    elapsedTime,
    currentPace,
    elevationGain,
    startRun,
    pauseRun,
    resumeRun,
    stopRun,
    resetRun,
  };
};