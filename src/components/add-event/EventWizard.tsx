"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import StepHeader from "./StepHeader";
import Step1EventDetails, { EventDateField } from "./Step1EventDetails";
import Step2Settings from "./Step2Settings";
import Step3Sessions, { InviteeRow, SessionInviteeFile } from "./Step3Sessions";
import MobileCardPreview from "./MobileCardPreview";
import SelectTemplateModal from "./modals/SelectTemplateModal";
import DateTimePickerModal from "./modals/DateTimePickerModal";
import InviteesPreviewModal from "./modals/InviteesPreviewModal";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import { categoryService, Category } from "@/services/categoryService";
import { DraftErrors, EventDraft, applyEventWindow, stepOfError, validateEventDraft } from "./eventDraft";
import { DraftStatus } from "@/hooks/useFormDraft";

type PickerTarget =
  | { kind: "event"; field: EventDateField }
  | { kind: "session"; key: string; field: "start" | "end" };

export interface EventWizardSubmit {
  draft: EventDraft;
  sessionFiles: Record<string, SessionInviteeFile | undefined>;
}

interface EventWizardProps {
  heading: string;
  headerIcon: React.ReactNode;
  draft: EventDraft;
  setDraft: (updater: (prev: EventDraft) => EventDraft) => void;
  draftStatus: DraftStatus;
  draftSavedAt: string | null;
  onDismissDraftStatus: () => void;
  onDiscardDraft: () => void;
  canDiscard: boolean;
  submitLabel: string;
  submitting: boolean;
  submitError: string | null;
  onSubmit: (input: EventWizardSubmit) => void;
  onCancel: () => void;
}

// Shared create/edit event wizard. The page owns the draft (and its persistence); the steps are controlled.
export default function EventWizard({
  heading,
  headerIcon,
  draft,
  setDraft,
  draftStatus,
  draftSavedAt,
  onDismissDraftStatus,
  onDiscardDraft,
  canDiscard,
  submitLabel,
  submitting,
  submitError,
  onSubmit,
  onCancel,
}: EventWizardProps) {
  const stepContentRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [logoFile, setLogoFile] = useState<{ name: string; url: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [sessionFiles, setSessionFiles] = useState<Record<string, SessionInviteeFile | undefined>>({});
  const [preview, setPreview] = useState<{ sessionKey?: string; sessionName: string; list: InviteeRow[] } | null>(null);

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res.success && Array.isArray(res.data)) setCategories(res.data);
      else setCategoriesError(res.message || "Failed to load categories.");
    });
  }, []);

  useEffect(() => {
    if (stepContentRef.current) {
      gsap.fromTo(stepContentRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" });
    }
  }, [currentStep]);

  // Release blob URLs created for the logo preview
  useEffect(() => () => {
    if (logoFile?.url.startsWith("blob:")) URL.revokeObjectURL(logoFile.url);
  }, [logoFile]);

  const allErrors = useMemo(() => validateEventDraft(draft), [draft]);
  const visibleErrors: DraftErrors = showErrors ? allErrors : {};

  const patch = (p: Partial<EventDraft>) => setDraft((prev) => ({ ...prev, ...p }));

  const goToStep = (step: number) => setCurrentStep(step);

  const handleStep1Next = () => {
    const step1Errors = Object.keys(allErrors).filter((k) => stepOfError(k) === 1);
    if (step1Errors.length > 0) {
      setShowErrors(true);
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    if (allErrors.thresholdLimit) {
      setShowErrors(true);
      return;
    }
    setCurrentStep(3);
  };

  const handleFinish = () => {
    const keys = Object.keys(allErrors);
    if (keys.length > 0) {
      setShowErrors(true);
      setCurrentStep(Math.min(...keys.map(stepOfError)));
      return;
    }
    onSubmit({ draft, sessionFiles });
  };

  const pickerValue = (() => {
    if (!pickerTarget) return null;
    if (pickerTarget.kind === "event") return draft[pickerTarget.field] || draft.start;
    const session = draft.sessions.find((s) => s.key === pickerTarget.key);
    return session ? session[pickerTarget.field] : null;
  })();

  const pickerTitle = (() => {
    if (!pickerTarget) return undefined;
    if (pickerTarget.kind === "event") {
      return pickerTarget.field === "start" ? "Event start" : pickerTarget.field === "end" ? "Event end" : "RSVP last date";
    }
    const session = draft.sessions.find((s) => s.key === pickerTarget.key);
    return `${session?.name || "Session"} ${pickerTarget.field === "start" ? "start" : "end"}`;
  })();

  // Writes the picked instant to exactly the field that opened the picker
  const handlePickerSave = (iso: string) => {
    const target = pickerTarget;
    if (!target) return;
    if (target.kind === "event") {
      if (target.field === "rsvpDeadline") patch({ rsvpDeadline: iso });
      else setDraft((prev) => applyEventWindow(prev, { [target.field]: iso }));
      return;
    }
    setDraft((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.key === target.key ? { ...s, [target.field]: iso, timesLinked: false } : s)),
    }));
  };

  const sessionOptions = draft.sessions.map((s) => ({ id: s.key, name: s.name || "Session" }));

  return (
    <div className="w-full flex-1 flex flex-col bg-[#F4F5F8] font-sans text-gray-800">
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {headerIcon}
            <h1 className="text-xl font-bold text-gray-900 tracking-tight truncate">{heading}</h1>
          </div>
          <UserNavDropdown />
        </header>

        {/* Draft status */}
        {(draftStatus !== "idle" || draftSavedAt || submitError) && (
          <div className="bg-white px-6 sm:px-8 pt-4 space-y-2">
            {draftStatus === "restored" && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs font-medium flex flex-wrap items-center justify-between gap-2">
                <span>Your unsaved draft was restored. Uploaded invitee files need to be attached again.</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={onDismissDraftStatus} className="font-semibold cursor-pointer">OK</button>
                  {canDiscard && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Discard this draft? The information you entered will be lost.")) {
                          setSessionFiles({});
                          setShowErrors(false);
                          setCurrentStep(1);
                          onDiscardDraft();
                        }
                      }}
                      className="font-semibold text-rose-600 cursor-pointer"
                    >
                      Discard draft
                    </button>
                  )}
                </div>
              </div>
            )}
            {draftStatus === "discarded-stale" && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-xs font-medium flex items-center justify-between gap-2">
                <span>An older unsaved draft was discarded because this event was changed since it was saved.</span>
                <button type="button" onClick={onDismissDraftStatus} className="font-semibold cursor-pointer shrink-0">OK</button>
              </div>
            )}
            {submitError && (
              <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-medium break-words">
                {submitError} Your entries are kept, so you can fix the problem and try again.
              </div>
            )}
            {draftSavedAt && draftStatus !== "restored" && (
              <p className="text-[11px] text-gray-400 font-medium">
                Draft saved on this device at {new Date(draftSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {canDiscard && (
                  <>
                    {" · "}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Discard this draft? The information you entered will be lost.")) {
                          setSessionFiles({});
                          setShowErrors(false);
                          setCurrentStep(1);
                          onDiscardDraft();
                        }
                      }}
                      className="underline cursor-pointer hover:text-rose-600"
                    >
                      Discard draft
                    </button>
                  </>
                )}
              </p>
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col lg:flex-row bg-white">
          <div className="w-full lg:w-[65%] flex flex-col min-w-0">
            <StepHeader currentStep={currentStep} onStepClick={goToStep} />

            <div ref={stepContentRef} className="flex-1">
              {currentStep === 1 && (
                <Step1EventDetails
                  draft={draft}
                  onChange={patch}
                  onOpenDatePicker={(field) => setPickerTarget({ kind: "event", field })}
                  categories={categories}
                  categoriesError={categoriesError}
                  errors={visibleErrors}
                  logoFile={logoFile}
                  setLogoFile={setLogoFile}
                  onNext={handleStep1Next}
                  onCancel={onCancel}
                />
              )}

              {currentStep === 2 && (
                <Step2Settings
                  draft={draft}
                  onChange={patch}
                  errors={visibleErrors}
                  onNext={handleStep2Next}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <Step3Sessions
                  sessions={draft.sessions}
                  onSessionsChange={(sessions) => patch({ sessions })}
                  sessionFiles={sessionFiles}
                  onSessionFileChange={(key, file) => setSessionFiles((prev) => ({ ...prev, [key]: file || undefined }))}
                  skipInvitees={draft.skipInvitees}
                  onSkipInviteesChange={(skipInvitees) => patch({ skipInvitees })}
                  eventStart={draft.start}
                  eventEnd={draft.end}
                  errors={visibleErrors}
                  onOpenSessionPicker={(key, field) => setPickerTarget({ kind: "session", key, field })}
                  onOpenInviteesPreview={(sessionName, list) => {
                    const session = draft.sessions.find((s) => s.name === sessionName);
                    setPreview({ sessionKey: session?.key, sessionName, list: list || [] });
                  }}
                  onFinish={handleFinish}
                  onBack={() => setCurrentStep(2)}
                  submitting={submitting}
                  submitLabel={submitLabel}
                />
              )}
            </div>
          </div>

          <div className="w-full lg:w-[35%] shrink-0 lg:sticky lg:top-4 self-start">
            <MobileCardPreview
              template={draft.template}
              eventTitle={draft.title}
              eventStart={draft.start}
              venue={draft.venue}
              onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <SelectTemplateModal
        key={isTemplateModalOpen ? "template-open" : "template-closed"}
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(template) => patch({ template })}
        selectedTemplateId={draft.template?.id}
        categoryId={draft.categoryId || undefined}
      />

      <DateTimePickerModal
        key={pickerTarget ? `${JSON.stringify(pickerTarget)}-${pickerValue ?? ""}` : "picker-closed"}
        isOpen={!!pickerTarget}
        onClose={() => setPickerTarget(null)}
        onSave={handlePickerSave}
        value={pickerValue}
        title={pickerTitle}
      />

      <InviteesPreviewModal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        sessionName={preview?.sessionName}
        inviteesList={preview?.list || []}
        sessionsOptions={sessionOptions}
        onSave={(updatedList) => {
          // Edited rows are submitted individually instead of the original file
          const key = preview?.sessionKey;
          if (key && sessionFiles[key]) {
            setSessionFiles((prev) => ({ ...prev, [key]: { ...prev[key]!, inviteesList: updatedList, edited: true } }));
          }
        }}
      />
    </div>
  );
}
