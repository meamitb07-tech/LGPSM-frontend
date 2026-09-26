import * as XLSX from "xlsx";

// Column layout accepted by POST /api/v1/events/:eventId/invitees/import
const TEMPLATE_ROWS = [
  { Name: "Guest Name", Email: "guest@example.com", Mobile: "+919876543210", "Company Name": "Company", "Dietary Preference": "Veg" },
];

// Downloads an .xlsx template with the expected invitee columns; returns false if generation failed
export function downloadInviteeTemplate(): boolean {
  try {
    const worksheet = XLSX.utils.json_to_sheet(TEMPLATE_ROWS);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invitees");
    XLSX.writeFile(workbook, "LGPSM_Invitee_Sample_Template.xlsx");
    return true;
  } catch (err) {
    console.error("Error generating sample excel:", err);
    return false;
  }
}
