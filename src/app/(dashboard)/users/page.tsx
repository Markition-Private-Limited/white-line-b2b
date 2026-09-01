"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  MoreVertical,
  KeyRound,
  ArrowRightLeft,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { FormInput } from "@/components/ui/FormInput";
import { FormDropdown } from "@/components/ui/FormDropdown";
import { DataTable, ColumnDef } from "@/components/layout/DataTableContainer";

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * limit;
    return users.slice(start, start + limit);
  }, [users, page, limit]);

  const totalPages = Math.max(1, Math.ceil(users.length / limit));

  const tableColumns = useMemo<ColumnDef<CorporateUser>[]>(() => [
    {
      header: "USER NAME",
      cell: (row) => <span className="font-semibold text-text-primary text-fs-12">{row.name}</span>,
    },
    {
      header: "EMAIL ADDRESS",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.email}</span>,
    },
    {
      header: "DATE ADDED",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.dateAdded}</span>,
    },
    {
      header: "ROLE",
      cell: (row) => <span className="font-semibold text-text-primary text-fs-12">{row.role}</span>,
    },
    {
      header: "STATUS",
      className: "text-center",
      cell: (row) => (
        <div className="flex justify-center">
          <Toggle
            checked={row.isActive}
            onChange={() => handleToggleActive(row.id, row.isActive)}
            label={row.isActive ? "Active" : "Inactive"}
          />
        </div>
      ),
    },
    {
      header: "LAST LOGIN",
      cell: (row) => <span className="text-text-secondary text-fs-12">{row.lastLogin}</span>,
    },
    {
      header: "ACTION",
      className: "text-center",
      cell: (row) => (
        <div className="flex justify-center relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuId(activeMenuId === row.id ? null : row.id);
            }}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-text-secondary cursor-pointer transition-colors"
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
                className="w-full flex items-center gap-2 px-3.5 py-2 text-fs-12 text-text-primary hover:bg-gray-50 cursor-pointer"
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
      {/* Top Card: Create New User Form */}
      <div className="card-base p-6 lg:p-7">
        <div className="mb-4">
          <h2 className="h2 font-medium text-text-primary mb-1">Create New User</h2>
          <p className="body-2 text-gray-text">Assign roles and grant access to team members.</p>
        </div>

        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <FormInput
            label="FULL NAME"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter Full Name"
            icon={<User className="w-4 h-4" />}
          />

          <FormInput
            label="EMAIL ADDRESS"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
            icon={<Mail className="w-4 h-4" />}
          />

          <FormDropdown
            label="ROLE SELECTION"
            options={["Admin", "Operations", "Finance"]}
            value={role}
            onSelect={(val) => setRole(val as any)}
          />

          <div>
            <Button
              type="submit"
              className="w-full h-[42px] text-fs-12 font-medium rounded-full bg-primary text-white hover:bg-primary-dark flex items-center justify-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create User
            </Button>
          </div>
        </form>
      </div>

      {/* Users Table Card */}
      <DataTable
        data={paginatedUsers}
        columns={tableColumns}
        pagination={{
          currentPage: page,
          totalPages,
          totalItems: users.length,
          itemsPerPage: limit,
          onPageChange: setPage,
          onRowsChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1);
          },
        }}
      />

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
              <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-1">Change Password</h3>
              <p className="text-fs-11 text-gray-400">
                Update security credentials for {changePasswordUser.name}
              </p>
            </div>

            <FormInput
              label="NEW PASSWORD"
              type={showPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              icon={<Lock className="w-4 h-4" />}
              rightIcon={showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <FormInput
              label="CONFIRM PASSWORD"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              icon={<Lock className="w-4 h-4" />}
            />

            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setChangePasswordUser(null)}
                className="flex-1 py-2.5 text-fs-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 py-2.5 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark"
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
              <h3 className="text-fs-17 font-bold font-poppins text-text-primary mb-1">
                Transfer Account Responsibilities
              </h3>
              <p className="text-fs-12 text-text-secondary leading-relaxed">
                Reassign all active requests and ownership from {transferUser.name} to another user. This action will transfer full administrative control.
              </p>
            </div>

            <FormDropdown
              label="SELECT NEW OWNER"
              options={[
                { label: "Elena Rodriguez — Fleet Manager", value: "Elena Rodriguez" },
                { label: "Julian Thorne — Operations Lead", value: "Julian Thorne" },
                { label: "Sarah Chen — Concierge Admin", value: "Sarah Chen" },
              ]}
              value={selectedNewOwner}
              onSelect={setSelectedNewOwner}
            />

            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTransferUser(null)}
                className="flex-1 py-2.5 text-fs-12"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleTransferOwnership}
                className="flex-1 py-2.5 text-fs-12 font-medium bg-primary text-white hover:bg-primary-dark"
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
