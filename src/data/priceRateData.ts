import { PriceHistoryRecord } from "@/types/priceRate";

export const initialPriceHistory: PriceHistoryRecord[] = [
  {
    id: "1",
    dateTime: "12 Jun 2026",
    previousRate: 2,
    newRate: 3,
    changeType: "Increase",
    status: "Active",
  },
  {
    id: "2",
    dateTime: "02 Feb 2026",
    previousRate: 3,
    newRate: 2,
    changeType: "Decrease",
    status: "Suspended",
  },
  {
    id: "3",
    dateTime: "12 Jan 2026",
    previousRate: 2,
    newRate: 3,
    changeType: "Increase",
    status: "Suspended",
  },
  {
    id: "4",
    dateTime: "19 Dec 2025",
    previousRate: 1,
    newRate: 2,
    changeType: "Increase",
    status: "Suspended",
  },
];
