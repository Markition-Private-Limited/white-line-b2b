"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  KeyRound,
  ArrowRightLeft,
  ChevronDown,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { cn } from "@/utils/cn";

interface CorporateUser {
  id: string;
  name: string;
  email: string;
  dateAdded: string;
  role: "Admin" | "Operations" | "Finance";
  isActive: boolean;
  lastLogin: string;
}

const initialUsers: CorporateUser[] = [
  { id: "1", name: "Alexander Miller", email: "alex.m@whiteline.com", dateAdded: "Feb 07, 2023", role: "Admin", isActive: true, lastLogin: "2 hours ago" },
  { id: "2", name: "Sarah Connor", email: "alex.m@whiteline.com", dateAdded: "Feb 07, 2023", role: "Operations", isActive: true, lastLogin: "Yesterday" },
  { id: "3", name: "David Beckham", email: "s.connor@whiteline.com", dateAdded: "Feb 07, 2023", role: "Finance", isActive: false, lastLogin: "1 week ago" },
  { id: "4", name: "Sarah Connor", email: "alex.m@whiteline.com", dateAdded: "Feb 07, 2023", role: "Operations", isActive: true, lastLogin: "Yesterday" },
  { id: "5", name: "David Beckham", email: "s.connor@whiteline.com", dateAdded: "Feb 07, 2023", role: "Finance", isActive: false, lastLogin: "1 week ago" },
  { id: "6", name: "Sarah Connor", email: "alex.m@whiteline.com", dateAdded: "Feb 07, 2023", role: "Operations", isActive: true, lastLogin: "Yesterday" },
  { id: "7", name: "David Beckham", email: "s.connor@whiteline.com", dateAdded: "Feb 07, 2023", role: "Finance", isActive: false, lastLogin: "1 week ago" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<CorporateUser[]>(initialUsers);

  // New User Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Admin" | "Operations" | "Finance">("Admin");

  // Actions & Modals State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [changePasswordUser, setChangePasswordUser] = useState<CorporateUser | null>(null);
  const [transferUser, setTransferUser] = useState<CorporateUser | null>(null);
  const [selectedNewOwner, setSelectedNewOwner] = useState("Elena Rodriguez");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccessModalOpen, setPasswordSuccessModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const newUser: CorporateUser = {
      id: Date.now().toString(),
      name: fullName,
      email,
      dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      role,
      isActive: true,
      lastLogin: "Just now",
    };

    setUsers([newUser, ...users]);
    setFullName("");
    setEmail("");
  };

  const handleToggleActive = (id: string, currentVal: boolean) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !currentVal } : u)));
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordUser(null);
    setPasswordSuccessModalOpen(true);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleTransferOwnership = () => {
    setTransferUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Card: Create New User Form */}
      <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
        <div className="mb-5">
          <h2 className="text-lg font-bold font-poppins text-gray-900">Create New User</h2>
          <p className="text-xs text-gray-400">Assign roles and grant access to team members.</p>
        </div>

        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">FULL NAME</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter Full Name"
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66] focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">ROLE SELECTION</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full appearance-none bg-gray-50/80 border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white cursor-pointer font-medium"
              >
                <option value="Admin">Admin</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold rounded-full bg-[#005C66] text-white hover:bg-[#004b54] flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create User
            </Button>
          </div>
        </form>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between min-h-[450px]">
        <div>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#005C66] text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4 rounded-tl-xl">USER NAME</th>
                  <th className="py-3 px-4">EMAIL ADDRESS</th>
                  <th className="py-3 px-4">DUE DATE</th>
                  <th className="py-3 px-4">ROLE</th>
                  <th className="py-3 px-4 text-center">SUBMITTED BY</th>
                  <th className="py-3 px-4">LAST LOGIN</th>
                  <th className="py-3 px-4 rounded-tr-xl text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {users.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{row.name}</td>
                    <td className="py-3 px-4 text-gray-500">{row.email}</td>
                    <td className="py-3 px-4 text-gray-500">{row.dateAdded}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{row.role}</td>
                    <td className="py-3 px-4 text-center">
                      <Toggle
                        checked={row.isActive}
                        onChange={() => handleToggleActive(row.id, row.isActive)}
                        label={row.isActive ? "Active" : "Inactive"}
                      />
                    </td>
                    <td className="py-3 px-4 text-gray-500">{row.lastLogin}</td>
                    <td className="py-3 px-4 text-center relative">
                      <div className="inline-block relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                          className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === row.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 text-left"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setChangePasswordUser(row);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                              Change Password
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTransferUser(row);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400" />
                              Transfer Account
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-400 mt-4">
          <span>Showing 5 of 1,284 results</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-full bg-[#005C66] text-white font-bold flex items-center justify-center text-[10px]">
              1
            </button>
            <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-[10px] text-gray-600">
              2
            </button>
            <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-[10px] text-gray-600">
              3
            </button>
            <span>...</span>
            <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-[10px] text-gray-600">
              124
            </button>
            <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={!!changePasswordUser}
        onClose={() => setChangePasswordUser(null)}
        maxWidth="max-w-md"
        className="p-6 md:p-8"
      >
        {changePasswordUser && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-poppins text-gray-900 mb-1">Change Password</h3>
              <p className="text-xs text-gray-400">
                Update security credentials for {changePasswordUser.name}
              </p>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">NEW PASSWORD</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CONFIRM PASSWORD</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setChangePasswordUser(null)}
                className="flex-1 py-2.5 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 py-2.5 text-xs font-semibold bg-[#005C66] text-white"
              >
                Update Password →
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Password Reset Success Modal */}
      <SuccessModal
        isOpen={passwordSuccessModalOpen}
        onClose={() => setPasswordSuccessModalOpen(false)}
        title="Password Reset Successfully"
        message="Now You can login with your new password."
        actionText="Done"
        onAction={() => setPasswordSuccessModalOpen(false)}
      />

      {/* Transfer Account Responsibilities Modal */}
      <Modal
        isOpen={!!transferUser}
        onClose={() => setTransferUser(null)}
        maxWidth="max-w-md"
        className="p-6 md:p-8"
      >
        {transferUser && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold font-poppins text-gray-900 mb-1">
                Transfer Account Responsibilities
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Reassign all active requests and ownership from {transferUser.name} to another user. This action will transfer full administrative control.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                SELECT NEW OWNER
              </label>
              <div className="relative">
                <select
                  value={selectedNewOwner}
                  onChange={(e) => setSelectedNewOwner(e.target.value)}
                  className="w-full appearance-none bg-gray-50/80 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-xs text-gray-900 focus:outline-none focus:border-[#005C66] focus:bg-white cursor-pointer font-medium"
                >
                  <option value="Elena Rodriguez">Elena Rodriguez — Fleet Manager</option>
                  <option value="Julian Thorne">Julian Thorne — Operations Lead</option>
                  <option value="Sarah Chen">Sarah Chen — Concierge Admin</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTransferUser(null)}
                className="flex-1 py-2.5 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleTransferOwnership}
                className="flex-1 py-2.5 text-xs font-semibold bg-[#005C66] text-white"
              >
                Transfer Ownership →
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
