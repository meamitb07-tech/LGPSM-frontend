import { InviteeLog, AccessLog, SessionReport } from "@/types/reports";

export const SAMPLE_INVITEE_LOGS: InviteeLog[] = [
  {
    id: "1",
    name: "Devon Lane",
    mobile: "9073181661",
    invitationStatus: "Successfully Send",
    rsvpStatus: "Accepted",
    checkInStatus: "Checked-in",
    lastCheckInTime: "10:07am",
    entrySession: true,
    lunchSession: false,
  },
  {
    id: "2",
    name: "Diego Alveraze",
    mobile: "9007000891",
    invitationStatus: "Successfully Send",
    rsvpStatus: "Pending",
    checkInStatus: "Not Checked-in",
    lastCheckInTime: "10:13 AM",
    entrySession: true,
    lunchSession: false,
  },
  {
    id: "3",
    name: "Joerge Higgins",
    mobile: "8240671922",
    invitationStatus: "Successfully Send",
    rsvpStatus: "Accepted",
    checkInStatus: "Partially Checked-in",
    lastCheckInTime: "12:54 AM",
    entrySession: true,
    lunchSession: true,
  },
  {
    id: "4",
    name: "Joerge Higgins",
    mobile: "8240671753",
    invitationStatus: "Sending failed",
    rsvpStatus: "Declined",
    checkInStatus: "Not Checked-in",
    lastCheckInTime: "--",
    entrySession: true,
    lunchSession: true,
  },
];

export const SAMPLE_ACCESS_LOGS: AccessLog[] = [
  {
    id: "a1",
    userType: "Admin",
    dateTime: "5/1/2026  10:03 AM",
    action: "Invitation list uploaded",
    status: "Successful",
  },
  {
    id: "a2",
    userType: "Admin",
    dateTime: "2/1/2026  02:18 PM",
    action: "Changed event date and time",
    status: "Successful",
  },
  {
    id: "a3",
    userType: "Super Admin",
    dateTime: "16/1/2026  11:00 AM",
    action: "Changed event category",
    status: "Successful",
  },
  {
    id: "a4",
    userType: "Admin",
    dateTime: "19/1/2026  07:56 AM",
    action: "Invitation send to invitees",
    status: "failed",
  },
];

export const SAMPLE_SESSIONS_REPORT: SessionReport[] = [
  {
    id: 1,
    name: "Entry Session",
    dateTime: "5/1/2026  10:00 AM",
    invitees: 510,
    attendees: 436,
    accessControl: "No Restriction",
    systemUsers: "05",
  },
  {
    id: 2,
    name: "Lunch Session",
    dateTime: "5/1/2026  10:00 AM  to  03:00 PM",
    invitees: 510,
    attendees: 436,
    accessControl: "Only Once",
    systemUsers: "08",
  },
  {
    id: 3,
    name: "Drink Session",
    dateTime: "5/1/2026  03:05 AM  to  04:30 PM",
    invitees: 110,
    attendees: 97,
    accessControl: "Only Once",
    systemUsers: "02",
  },
];
