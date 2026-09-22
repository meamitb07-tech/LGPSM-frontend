export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  isRead?: boolean;
  type?: "system" | "payment" | "event" | "qr";
}
