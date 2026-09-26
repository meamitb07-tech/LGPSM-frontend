import { EventSettingsOptions } from "@/types/settings";

// Default toggle state for the Event Settings screen (UI configuration, not application data)
export const defaultEventSettings: EventSettingsOptions = {
  allowEventRSVP: false,
  acceptInvitedAttendees: true,
  chooseNotRespondedInvitees: true,
  chooseRSVPDeclinedInvitees: false,
  askFoodPreference: true,
};
