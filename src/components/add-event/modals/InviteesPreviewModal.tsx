"use client";

import React, { useState, useEffect, useRef } from "react";
import EditInviteeModal from "./EditInviteeModal";
import DeleteInviteeModal from "./DeleteInviteeModal";
import CustomDropdown from "@/components/common/CustomDropdown";
import { gsap } from "gsap";

interface InviteeRow {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface InviteesPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedList: InviteeRow[]) => void;
  onDelete?: (id: string) => void | Promise<void>;
  onEdit?: (updated: InviteeRow) => void | Promise<void>;
  inviteesList?: InviteeRow[];
  sessionName?: string;
  sessionsOptions?: { id: string; name: string }[];
}

export default function InviteesPreviewModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  onEdit,
  inviteesList = [],
  sessionName,
  sessionsOptions = [],
}: InviteesPreviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [list, setList] = useState<InviteeRow[]>(inviteesList);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvitee, setEditingInvitee] = useState<InviteeRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const dropdownOptions = React.useMemo(() => {
    const opts: { value: string; label: string }[] = [
      { value: "all", label: "All Sessions" },
    ];
    sessionsOptions.forEach((s) => {
      opts.push({ value: s.id, label: s.name });
    });
    return opts;
  }, [sessionsOptions]);

  const [selectedSession, setSelectedSession] = useState<string>("all");

  useEffect(() => {
    if (isOpen) {
      if (inviteesList) setList(inviteesList);
      const matched = dropdownOptions.find(
        (opt) => opt.value === selectedSession || (sessionName && opt.label.toLowerCase().includes(sessionName.toLowerCase()))
      );
      if (matched) {
        setSelectedSession(matched.value);
      } else if (dropdownOptions.length > 0) {
        setSelectedSession(dropdownOptions[0].value);
      }
    }
  }, [isOpen, inviteesList, sessionsOptions, sessionName, dropdownOptions]);

  useEffect(() => {
    if (isOpen && overlayRef.current && modalRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.fromTo(
          modalRef.current,
          { scale: 0.8, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.2)" }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredList = list.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEdit = async (updated: InviteeRow) => {
    setList(list.map((item) => (item.id === updated.id ? updated : item)));
    if (onEdit) {
      await onEdit(updated);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      const targetId = deletingId;
      setList(list.filter((item) => item.id !== targetId));
      setDeletingId(null);
      if (onDelete) {
        await onDelete(targetId);
      }
    }
  };

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans"
      >
        <div
          ref={modalRef}
          className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] my-auto relative"
        >
          {/* Header (Image 2) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-900">
              Invitees List Preview{" "}
              <span className="text-xs font-normal text-gray-500">
                ({list.length} Invitees)
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters (Image #3) */}
          <div className="p-6 pb-2 space-y-1.5">
            <label className="block text-xs font-bold text-gray-900">Search</label>
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-[#F9FAFB] focus-within:border-[#FF5B22] focus-within:ring-1 focus-within:ring-[#FF5B22]">
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-transparent text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              <div className="border-l border-gray-200 px-2 py-1 bg-white flex items-center shrink-0 w-52">
                <CustomDropdown
                  value={selectedSession}
                  onChange={(val) => setSelectedSession(val)}
                  options={dropdownOptions}
                  placeholder="Select Session"
                />
              </div>
            </div>
          </div>

          {/* Table Content (Image #3) */}
          <div className="flex-1 overflow-y-auto px-6 py-3 min-h-[300px]">
            <p className="text-xs font-bold text-gray-900 mb-2">Lists</p>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F5F8] border-b border-gray-200 text-gray-700 font-bold">
                  <tr>
                    <th className="px-4 py-3 w-12 text-gray-900 font-bold">#</th>
                    <th className="px-4 py-3 text-gray-900 font-bold">Name</th>
                    <th className="px-4 py-3 text-gray-900 font-bold">Email</th>
                    <th className="px-4 py-3 text-gray-900 font-bold">Phone no.</th>
                    <th className="px-4 py-3 text-center text-gray-900 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800 font-medium">
                  {filteredList.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{row.id}</td>
                      <td className="px-4 py-3.5 font-semibold text-gray-900">{row.name}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.email}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.phone}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Action Box (Image #3: Rose/Orange border box with edit pencil icon) */}
                          <button
                            type="button"
                            onClick={() => setEditingInvitee(row)}
                            className="p-1.5 text-[#FF5B22] border border-rose-300 rounded bg-[#FFF0EB] hover:bg-[#FFE5DC] transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          {/* Delete Action Box (Image #3: Rose/Orange border box with trash icon) */}
                          <button
                            type="button"
                            onClick={() => setDeletingId(row.id)}
                            className="p-1.5 text-[#FF5B22] border border-rose-300 rounded bg-[#FFF0EB] hover:bg-[#FFE5DC] transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer (Image #3: Bright Orange Save button) */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (onSave) onSave(list);
                onClose();
              }}
              className="px-7 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-md transition-all shadow-xs cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Edit & Delete Action Modals */}
      <EditInviteeModal
        isOpen={Boolean(editingInvitee)}
        onClose={() => setEditingInvitee(null)}
        invitee={editingInvitee}
        onSave={handleSaveEdit}
      />

      <DeleteInviteeModal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
