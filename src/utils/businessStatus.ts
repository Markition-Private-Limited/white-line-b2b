import { dateOnly, getRiyadhISODate } from "@/utils/datetime";

type InvoiceLike = { status?: string | null; due_date?: string | null };
type ServiceRequestLike = { status?: string | null; end_date?: string | null };

export function getInvoiceDisplayStatus(invoice: InvoiceLike): string {
  const status = invoice.status?.toLowerCase() || "unpaid";
  const dueDate = dateOnly(invoice.due_date);
  if (status !== "paid" && dueDate && dueDate < getRiyadhISODate()) return "overdue";
  return status;
}

export function isInvoiceDueSoon(invoice: InvoiceLike): boolean {
  if (getInvoiceDisplayStatus(invoice) === "paid") return false;
  const dueDate = dateOnly(invoice.due_date);
  if (!dueDate) return false;
  const today = getRiyadhISODate();
  const days = (Date.parse(`${dueDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000;
  return days >= 0 && days <= 7;
}

export function getServiceRequestDisplayStatus(request: ServiceRequestLike): string {
  const status = request.status?.toLowerCase() || "pending";
  const endDate = dateOnly(request.end_date);
  if (status === "pending" && endDate && endDate < getRiyadhISODate()) return "expired";
  return status;
}
