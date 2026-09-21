export function getActiveItemFromPathname(pathname: string): string {
  if (!pathname) return "dashboard";
  if (pathname.includes("/events/add")) return "add-event";
  if (pathname.includes("/invitees")) return "invitees-management";
  if (pathname.includes("/sessions")) return "event-management";
  if (pathname.includes("/assign")) return "assign-system-users";
  if (pathname.startsWith("/events")) return "events-list";
  if (pathname.startsWith("/user-management/add")) return "add-user";
  if (pathname.startsWith("/user-management")) return "all-users";
  if (pathname.startsWith("/event-organizer/add")) return "add-organizer";
  if (pathname.startsWith("/event-organizer")) return "all-organizers";
  if (pathname.startsWith("/templates")) return "templates";
  if (pathname.startsWith("/earnings")) return "earnings";
  if (pathname.startsWith("/reports")) return "reports";
  if (pathname.startsWith("/settings/template")) return "template-settings";
  if (pathname.startsWith("/settings/event")) return "event-settings";
  if (pathname.startsWith("/settings/price-rate")) return "price-rate-settings";
  if (pathname.startsWith("/settings/notification")) return "notification-settings";
  if (pathname.startsWith("/settings/account")) return "account-settings";
  if (pathname.startsWith("/settings")) return "template-settings";
  if (pathname.startsWith("/notification") || pathname.startsWith("/notifications")) return "notification";
  return "dashboard";
}
