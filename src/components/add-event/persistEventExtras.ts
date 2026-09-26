import { sessionService } from "@/services/sessionService";
import { inviteeService } from "@/services/inviteeService";
import { DraftSession, EventDraft, sessionToRequest } from "./eventDraft";
import { SessionInviteeFile } from "./Step3Sessions";

function sessionChanged(a: DraftSession, b: DraftSession): boolean {
  return (
    a.name.trim() !== b.name.trim() ||
    new Date(a.start).getTime() !== new Date(b.start).getTime() ||
    new Date(a.end).getTime() !== new Date(b.end).getTime() ||
    a.accessControl !== b.accessControl ||
    a.validateAgainstOtherSessions !== b.validateAgainstOtherSessions
  );
}

// Saves sessions and invitee lists after the event itself was saved.
// Returns human-readable problems so the caller can report partial failures instead of hiding them.
export async function persistSessionsAndInvitees(
  eventId: string,
  draft: EventDraft,
  sessionFiles: Record<string, SessionInviteeFile | undefined>,
  originalSessions: DraftSession[] = []
): Promise<string[]> {
  const problems: string[] = [];

  for (const session of draft.sessions) {
    if (session.backendId) {
      const original = originalSessions.find((o) => o.backendId === session.backendId);
      if (original && !sessionChanged(original, session)) continue;
      const res = await sessionService.updateSession(session.backendId, sessionToRequest(session));
      if (!res.success) problems.push(`Session "${session.name}": ${res.message || "could not be updated"}`);
    } else {
      const res = await sessionService.createSession(eventId, sessionToRequest(session));
      if (!res.success) problems.push(`Session "${session.name}": ${res.message || "could not be created"}`);
    }
  }

  if (draft.skipInvitees) return problems;

  for (const session of draft.sessions) {
    const fileInfo = sessionFiles[session.key];
    if (!fileInfo) continue;

    if (fileInfo.edited) {
      let failed = 0;
      for (const row of fileInfo.inviteesList) {
        const res = await inviteeService.createInvitee(eventId, {
          name: row.name,
          email: row.email || undefined,
          mobile: row.phone || undefined,
        });
        if (!res.success) failed++;
      }
      if (failed > 0) problems.push(`${failed} invitee(s) from "${fileInfo.name}" could not be added`);
    } else {
      const res = await inviteeService.importExcel(eventId, fileInfo.file);
      if (!res.success) {
        problems.push(`Invitee file "${fileInfo.name}": ${res.message || "import failed"}`);
      } else if (res.data && res.data.rejected > 0) {
        problems.push(`Invitee file "${fileInfo.name}": ${res.data.rejected} row(s) rejected`);
      }
    }
  }

  return problems;
}
