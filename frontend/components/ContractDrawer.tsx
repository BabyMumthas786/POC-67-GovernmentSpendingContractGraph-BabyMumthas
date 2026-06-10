"use client";

import type { Contract } from "@/lib/types";
import { formatFullCurrency } from "@/lib/utils";

interface ContractDrawerProps {
  contracts: Contract[];
  isOpen: boolean;
  onClose: () => void;
  sourceName: string;
  targetName: string;
  totalAmount: number;
}

function StatusBadge({ status }: { status: string }) {
  const cls = `badge badge-${status.toLowerCase()}`;
  return <span className={cls}>{status}</span>;
}

export default function ContractDrawer({
  contracts, isOpen, onClose, sourceName, targetName, totalAmount,
}: ContractDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" id="contract-drawer">
        <div className="drawer-header">
          <div>
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Contract Details
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {sourceName} → {targetName}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary p-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {/* Summary */}
          <div className="p-3 rounded-lg mb-4" style={{ background: "var(--bg-tertiary)" }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="drawer-field-label">Total Amount</p>
                <p className="text-lg font-bold" style={{ color: "var(--accent-blue)" }}>
                  {formatFullCurrency(totalAmount)}
                </p>
              </div>
              <div>
                <p className="drawer-field-label">Contracts</p>
                <p className="text-lg font-bold" style={{ color: "var(--accent-green)" }}>
                  {contracts.length}
                </p>
              </div>
            </div>
          </div>

          {/* Contract List */}
          <div className="space-y-3">
            {contracts.map((c) => (
              <div key={c.contract_id} className="card p-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    {c.contract_id}
                  </span>
                  <StatusBadge status={c.status} />
                </div>

                <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {c.contract_title}
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div className="drawer-field">
                    <p className="drawer-field-label">Amount</p>
                    <p className="drawer-field-value">{formatFullCurrency(c.amount)}</p>
                  </div>
                  <div className="drawer-field">
                    <p className="drawer-field-label">Year</p>
                    <p className="drawer-field-value">{c.year}</p>
                  </div>
                  <div className="drawer-field">
                    <p className="drawer-field-label">Category</p>
                    <p className="drawer-field-value">{c.category}</p>
                  </div>
                  <div className="drawer-field">
                    <p className="drawer-field-label">Status</p>
                    <p className="drawer-field-value">{c.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
