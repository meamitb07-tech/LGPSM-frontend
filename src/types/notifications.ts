export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  message?: string;
  date?: string;
  time?: string;
  timestamp?: string;
  isRead?: boolean;
  type?: string;
}
