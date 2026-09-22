import { EarningsRecord } from "@/types/earnings";

export const SAMPLE_ORGANIZER_RECORDS: EarningsRecord[] = [
  { id: "1", organizer: "JK Event Management", eventName: "Year Ending Financial Meeting", dateOfPayment: "12 Jan 2026", invites: 100, rate: 3, amount: 300 },
  { id: "2", organizer: "Navkrit Brand Solution", eventName: "My Lil Girl Aanvika's Birthday", dateOfPayment: "02 Feb 2026", invites: 250, rate: 3, amount: 450 },
  { id: "3", organizer: "Anjali Groups & Sons", eventName: "Sujana's Reception Party", dateOfPayment: "27 Jan 2026", invites: 300, rate: 3, amount: 900 },
  { id: "4", organizer: "Iconic Event Planner", eventName: "Tech Summit 2026", dateOfPayment: "2nd feb 2026", invites: 200, rate: 3, amount: 600 },
  { id: "5", organizer: "Albert Flores", eventName: "Summer Gala 21", dateOfPayment: "12 jan 2026", invites: 10, rate: 3, amount: 30 },
  { id: "6", organizer: "Global Enterprise", eventName: "Product Launch Event 2026", dateOfPayment: "15 Mar 2026", invites: 500, rate: 3, amount: 1500 },
  { id: "7", organizer: "Nexus Event Group", eventName: "Annual Tech Conference", dateOfPayment: "20 Apr 2026", invites: 400, rate: 3, amount: 1200 },
];

export const SAMPLE_EVENT_RECORDS: EarningsRecord[] = [
  { id: "e1", eventName: "Year Ending Financial Meeting", organizer: "JK Event Management", dateOfPayment: "12 Jan 2026", invites: 10, rate: 3, amount: 30 },
  { id: "e2", eventName: "My Lil Girl Aanvika's Birthday", organizer: "Navkrit Brand Solution", dateOfPayment: "02 Feb 2026", invites: 25, rate: 3, amount: 45 },
  { id: "e3", eventName: "Sujana's Reception Party", organizer: "Anjali Groups & Sons", dateOfPayment: "27 Jan 2026", invites: 30, rate: 3, amount: 90 },
  { id: "e4", eventName: "Tech Summit 2026", organizer: "Iconic Event Planner", dateOfPayment: "02 Feb 2026", invites: 200, rate: 3, amount: 600 },
  { id: "e5", eventName: "Summer Gala 21", organizer: "Albert Flores", dateOfPayment: "12 Jan 2026", invites: 10, rate: 3, amount: 30 },
];
