export interface EarningsRecord {
  id: string;
  organizer: string;
  eventName: string;
  dateOfPayment: string;
  invites: number;
  rate: number;
  amount: number;
  // ISO start of the event, used for the date-range filter
  eventStart?: string;
}
