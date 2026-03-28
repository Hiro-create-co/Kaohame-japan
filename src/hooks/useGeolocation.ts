"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  denied: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    denied: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "お使いのブラウザは位置情報に対応していません",
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
          denied: false,
        });
      },
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED;
        let message = "位置情報の取得に失敗しました";
        if (denied) {
          message = "位置情報の許可が必要です";
        } else if (error.code === error.TIMEOUT) {
          message = "位置情報の取得がタイムアウトしました";
        }
        setState((prev) => ({
          ...prev,
          error: message,
          loading: false,
          denied,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { ...state, requestLocation };
}
