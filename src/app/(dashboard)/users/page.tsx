"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  MoreVertical, KeyRound, ArrowRightLeft, Lock, Eye, EyeOff, UserPlus, Mail, User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";
import { PasswordStrengthBar } from "@/components/ui/PasswordStrengthBar";
import { FormDropdown } from "@/components/ui/FormDropdown";
import { DataTable, type ColumnDef } from "@/components/layout/DataTableContainer";
import usersService, { type SpocUser } from "@/services/users.service";

const LIMIT = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<SpocUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Create user form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Actions & Modals
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [changePasswordUser, setChangePasswordUser] = useState<SpocUser | null>(null);
  const [transferUser, setTransferUser] = useState<SpocUser | null>(null);
  const [selectedNewOwnerId, setSelectedNewOwnerId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccessModalOpen, setPasswordSuccessModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    usersService.list(page)
      .then((res) => { setUsers(res.data ?? []); setTotal(res.total ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setActiveMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const newUser = await usersService.create({ full_name: fullName, email, role, password });
      setUsers([newUser, ...users]);
      setTotal((t) => t + 1);
      setFullName(""); setEmail(""); setPassword("");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setCreateError(typeof msg === "string" ? msg : "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updated = await usersService.toggleStatus(id);
      setUsers((prev) => prev.map((u) => u.id === id ? updated : u));
    } catch {}
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePasswordUser) return;
    if (newPassword !== confirmPassword) { setActionError("Passwords do not match."); return; }
    setActionLoading(true); setActionError("");
    try {
      await usersService.changePassword(changePasswordUser.id, newPassword);
      setChangePasswordUser(null);
      setPasswordSuccessModalOpen(true);
      setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setActionError(typeof msg === "string" ? msg : "Failed to update password.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!transferUser || !selectedNewOwnerId) return;
    setActionLoading(true); setActionError("");
    try {
      await usersService.transfer(transferUser.id, selectedNewOwnerId);
      setTransferUser(null);
      fetchUsers();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setActionError(typeof msg === "string" ? msg : "Transfer failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const otherUsers = users.filter((u) => !u.is_account_owner);
  const transferOptions = otherUsers
    .filter((u) => transferUser && u.id !== transferUser.id)
    .map((u) => ({ label: `${u.full_name} — ${u.role}`, value: u.id }));

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const tableColumns = useMemo<ColumnDef<SpocUser>[]>(() => [
    { header: "USER NAME", cell: (row) => <span className="font-semibold text-text-primary text-fs-12">{row.full_name}</span> },
    { header: "EMAIL ADDRESS", cell: (row) => <span className="text-text-secondary text-fs-12">{row.email}</span> },
    { header: "DATE ADDED", cell: (row) => <span className="text-text-secondary text-fs-12">{formatDate(row.created_at)}</span> },
    { header: "ROLE", cell: (row) => <span className="font-semibold text-text-primary text-fs-12">{row.role}</span> },
    {
      header: "STATUS",
      className: "text-center",
      cell: (row) => (
        <div className="flex justify-center">
          <Toggle
            checked={row.status === "active"}
            onChange={() => handleToggleActive(row.id)}
            label={row.status === "active" ? "Active" : "Inactive"}
          />
        </div>
      ),
    },
    {
      header: "LAST LOGIN",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.last_login ? formatDate(row.last_login) : "Never"}</span>,
    },
    {
      header: "ACTION",
      className: "text-center",
      cell: (row) => (
        <div className="flex justify-center relative">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === row.id ? null : row.id); }}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-text-secondary cursor-pointer transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {activeMenuId === row.id && (
            <div ref={menuRef} className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 text-left">
              <button
                type="button"
                onClick={() => { setChangePasswordUser(row); setActiveMenuId(null); }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-fs-12 text-text-primary hover:bg-gray-50 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                Change Password
              </button>
              <button
                type="button"
                onClick={() => { setTransferUser(row); setSelectedNewOwnerId(""); setActionError(""); setActiveMenuId(null); }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-fs-12 text-text-primary hover:bg-gray-50 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400" />
                Transfer Account
              </button>
            </div>
          )}
        </div>
      ),
    },
  ], [activeMenuId, users]);

  return (
    <div className="space-y-4">
      {/* Create New User Form */}
      <div className="card-base p-6 lg:p-7">
        <div className="mb-4">
          <h2 className="h2 font-medium text-text-primary mb-1">Create New User</h2>
          <p className="body-2 text-gray-text">Assign roles and grant access to team members.</p>
        </div>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <FormInput label="FULL NAME" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter Full Name" icon={<User className="w-4 h-4" />} />
          <FormInput label="EMAIL ADDRESS" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email Address" icon={<Mail className="w-4 h-4" />} />
          <FormInput label="PASSWORD" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set password" icon={<Lock className="w-4 h-4" />} />
          <FormDropdown label="ROLE SELECTION" options={["Admin", "Operations", "Finance"]} value={role} onSelect={setRole} />
          <div>
            <Button type="submit" isLoading={creating} className="w-full h-[42px] text-fs-12 font-medium rounded-full bg-primary text-white hover:bg-primary-dark flex items-center justify-center gap-1.5 shadow-sm">
              <UserPlus className="w-3.5 h-3.5" />
              Create User
            </Button>
          </div>
        </form>
        {createError && <p className="text-fs-11 text-red-600 mt-2">{createError}</p>}
      </div>

      {/* Users Table */}
      <DataTable
        data={users}
        columns={tableColumns}
        loading={loading}
        pagination={{ currentPage: page, totalPages, totalItems: total, itemsPerPage: LIMIT, onPageChange: setPage }}
      />

      {/* Change Password Modal */}
      <Modal isOpen={!!changePasswordUser} onClose={() => { setChangePasswordUser(null); setActionError(""); }} maxWidth="max-w-md" className="p-6 md:p-8">
        {changePasswordUser && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-1">Change Password</h3>
              <p className="text-fs-11 text-gray-400">Update security credentials for {changePasswordUser.full_name}</p>
            </div>
            <FormInput label="NEW PASSWORD" type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" icon={<Lock className="w-4 h-4" />} rightIcon={showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} onRightIconClick={() => setShowPassword(!showPassword)} />
            <PasswordStrengthBar password={newPassword} />
            <FormInput label="CONFIRM PASSWORD" type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" icon={<Lock className="w-4 h-4" />} />
            {actionError && <p className="text-fs-11 text-red-600">{actionError}</p>}
            <div className="flex items-center gap-3 pt-3">
              <Button type="button" variant="outline" onClick={() => setChangePasswordUser(null)} className="flex-1 py-2.5 text-fs-12 text-red-600 hover:bg-red-50 hover:text-red-600">Cancel</Button>
              <Button type="submit" isLoading={actionLoading} className="flex-1 py-2.5 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark">Update Password →</Button>
            </div>
          </form>
        )}
      </Modal>

      <SuccessModal isOpen={passwordSuccessModalOpen} onClose={() => setPasswordSuccessModalOpen(false)} title="Password Reset Successfully" message="The user can now log in with the new password." actionText="Done" onAction={() => setPasswordSuccessModalOpen(false)} />

      {/* Transfer Account Modal */}
      <Modal isOpen={!!transferUser} onClose={() => { setTransferUser(null); setActionError(""); }} maxWidth="max-w-md" className="p-6 md:p-8">
        {transferUser && (
          <div className="space-y-5">
            <div>
              <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-1">Transfer Account Responsibilities</h3>
              <p className="text-fs-12 text-text-secondary leading-relaxed">Reassign all active requests and ownership from {transferUser.full_name} to another user.</p>
            </div>
            <FormDropdown
              label="SELECT NEW OWNER"
              options={transferOptions.length > 0 ? transferOptions : [{ label: "No other users available", value: "" }]}
              value={selectedNewOwnerId}
              onSelect={setSelectedNewOwnerId}
            />
            {actionError && <p className="text-fs-11 text-red-600">{actionError}</p>}
            <div className="flex items-center gap-3 pt-3">
              <Button type="button" variant="outline" onClick={() => setTransferUser(null)} className="flex-1 py-2.5 text-fs-12 text-red-600 hover:bg-red-50 hover:text-red-600">Cancel</Button>
              <Button type="button" isLoading={actionLoading} onClick={handleTransferOwnership} disabled={!selectedNewOwnerId} className="flex-1 py-2.5 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark">Transfer Ownership →</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
