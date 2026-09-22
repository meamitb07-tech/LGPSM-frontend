import {
  TemplateCategory,
  TemplateSubcategory,
  TemplateItem,
  EventSettingsOptions,
  PriceRateSettings,
  NotificationSettingsOptions,
  AccountSettingsProfile,
} from "@/types/settings";

export const initialCategories: TemplateCategory[] = [
  { id: "personal", name: "Personal" },
  { id: "corporate", name: "Corporate" },
  { id: "sports", name: "Sports" },
  { id: "entertainment", name: "Entertainment" },
  { id: "social", name: "Social" },
];

export const initialSubcategories: TemplateSubcategory[] = [
  { id: "birthday", categoryId: "personal", name: "Birthday" },
  { id: "wedding", categoryId: "personal", name: "Wedding" },
  { id: "anniversary", categoryId: "personal", name: "Anniversary" },
  { id: "conference", categoryId: "corporate", name: "Conference" },
  { id: "seminar", categoryId: "corporate", name: "Seminar" },
];

export const initialTemplates: TemplateItem[] = [
  {
    id: "1",
    name: "Claudia Birthday Card",
    categoryId: "personal",
    subcategoryId: "birthday",
    imageUrl: "/images/auth/login_side_img.png",
    status: "Saved on Draft",
    createdAt: "2026-09-01",
  },
  {
    id: "2",
    name: "Happy Birthday Gold Crown",
    categoryId: "personal",
    subcategoryId: "birthday",
    imageUrl: "/images/auth/login_side_img.png",
    status: "Published",
    createdAt: "2026-09-02",
  },
  {
    id: "3",
    name: "Classic Floral Birthday",
    categoryId: "personal",
    subcategoryId: "birthday",
    imageUrl: "/images/auth/login_side_img.png",
    status: "Published",
    createdAt: "2026-09-03",
  },
  {
    id: "4",
    name: "Pink Velvet Birthday",
    categoryId: "personal",
    subcategoryId: "birthday",
    imageUrl: "/images/auth/login_side_img.png",
    status: "Published",
    createdAt: "2026-09-04",
  },
  {
    id: "5",
    name: "Polaroid Celebration Card",
    categoryId: "personal",
    subcategoryId: "birthday",
    imageUrl: "/images/auth/login_side_img.png",
    status: "Saved on Draft",
    createdAt: "2026-09-05",
  },
  {
    id: "6",
    name: "Yellow Balloons Party",
    categoryId: "personal",
    subcategoryId: "birthday",
    imageUrl: "/images/auth/login_side_img.png",
    status: "Published",
    createdAt: "2026-09-06",
  },
  {
    id: "7",
    name: "Samira's Evening Gala",
    categoryId: "personal",
    subcategoryId: "birthday",
    imageUrl: "/images/auth/login_side_img.png",
    status: "Saved on Draft",
    createdAt: "2026-09-07",
  },
];

export const defaultEventSettings: EventSettingsOptions = {
  allowEventRSVP: false,
  acceptInvitedAttendees: true,
  chooseNotRespondedInvitees: true,
  chooseRSVPDeclinedInvitees: false,
  askFoodPreference: true,
};

export const defaultPriceRateSettings: PriceRateSettings = {
  organizerFeeRate: 25.0,
  perInviteeRate: 1.5,
  taxPercentage: 5.0,
  currency: "USD ($)",
  autoBillingEnabled: true,
};

export const defaultNotificationSettings: NotificationSettingsOptions = {
  emailNotifications: true,
  smsNotifications: false,
  systemAlerts: true,
  eventReminders: true,
  weeklySummary: false,
};

export const defaultAccountProfile: AccountSettingsProfile = {
  fullName: "Super Admin",
  email: "admin@lgpsm.com",
  phone: "+1 (555) 234-5678",
  role: "Super Admin",
  avatarUrl: "/images/navbar/Nav_logo.png",
};
