"use client";

import React, { useState, useEffect, useRef } from "react";
import EditInviteeModal from "./EditInviteeModal";
import DeleteInviteeModal from "./DeleteInviteeModal";
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
  inviteesList?: InviteeRow[];
  sessionName?: string;
}

const DEFAULT_INVITEES: InviteeRow[] = [
  { id: "01", name: "Moloy Roy", email: "diya.patel@yahoo.com", phone: "+919062906466" },
  { id: "02", name: "Chanchal Roy", email: "meera.jain@yahoo.com", phone: "+918442128334" },
  { id: "03", name: "Souvik K", email: "vihaan.chopra@outlook.com", phone: "+916787249381" },
  { id: "04", name: "Subhendu Bhattacharjee", email: "ishaan.jain@hotmail.com", phone: "+919474963438" },
  { id: "05", name: "Sayan Ghosh", email: "vihaan.jain@hotmail.com", phone: "+916327018843" },
  { id: "06", name: "Sharmila Poddar", email: "arjun.verma@outlook.com", phone: "+919616263073" },
  { id: "07", name: "Online User A", email: "user.a@example.com", phone: "+919876543210" },
  { id: "08", name: "Online User B", email: "user.b@example.com", phone: "+919876543211" },
];

export default function InviteesPreviewModal({
  isOpen,
  onClose,
  inviteesList = DEFAULT_INVITEES,
  sessionName = "Session 1 - Entry Session",
}: InviteesPreviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [list, setList] = useState<InviteeRow[]>(inviteesList);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvitee, setEditingInvitee] = useState<InviteeRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleSaveEdit = (updated: InviteeRow) => {
    setList(list.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setList(list.filter((item) => item.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-[family-name:var(--font-space-grotesk)]">
        <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] my-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">
              Invitees List Preview <span className="text-xs font-normal text-gray-500">({list.length} Invitees)</span>
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

          {/* Filters */}
          <div className="p-6 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Session</label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none">
                <option>{sessionName}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-y-auto px-6 py-3 min-h-[300px]">
            <p className="text-xs font-semibold text-gray-700 mb-2">Lists</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">#</th>
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Phone no.</th>
                    <th className="px-4 py-2.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  {filteredList.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono">{row.id}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{row.name}</td>
                      <td className="px-4 py-3 text-gray-500">{row.email}</td>
                      <td className="px-4 py-3 text-gray-500">{row.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingInvitee(row)}
                            className="p-1 text-[#FF5B22] border border-[#FF5B22]/30 rounded bg-[#FF5B22]/5 hover:bg-[#FF5B22]/15 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 210.3H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => setDeletingId(row.id)}
                            className="p-1 text-red-500 border border-red-200 rounded bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
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

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
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
