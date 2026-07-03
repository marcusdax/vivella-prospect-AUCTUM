import { useAlertStore } from '../stores/alertStore';

export function useAlerts() {
  return useAlertStore();
}
