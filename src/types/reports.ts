export interface InviteeLog {
  id: string;
  name: string;
  mobile: string;
  invitationStatus: "Successfully Send" | "Sending failed";
  rsvpStatus: "Accepted" | "Pending" | "Declined";
  checkInStatus: "Checked-in" | "Not Checked-in" | "Partially Checked-in";
  lastCheckInTime: string;
  entrySession: boolean;
  lunchSession: boolean;
}

export interface AccessLog {
  id: string;
  userType: string;
  dateTime: string;
  action: string;
  status: "Successful" | "failed";
}

export interface SessionReport {
  id: number;
  name: string;
  dateTime: string;
  invitees: number;
  attendees: number;
  accessControl: string;
  systemUsers: string;
}
