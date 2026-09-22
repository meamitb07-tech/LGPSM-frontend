export interface PriceHistoryRecord {
  id: string;
  dateTime: string;
  previousRate: number;
  newRate: number;
  changeType: "Increase" | "Decrease";
  status: "Active" | "Suspended";
}
