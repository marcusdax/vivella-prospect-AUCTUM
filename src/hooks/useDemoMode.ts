import { useSettingsStore } from '../stores/settingsStore';

export function useDemoMode() {
  return useSettingsStore((s) => ({
    useLiveGeo: s.useLiveGeo,
    mapStyle: s.mapStyle,
    setUseLiveGeo: s.setUseLiveGeo,
    setMapStyle: s.setMapStyle,
  }));
}
