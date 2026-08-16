import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddWalletModal, Modal } from '../components/Modals';

export const WalletsPage: React.FC = () => {
  const { wallets, formatCurrency, adjustWalletBalance, archiveWallet, restoreWallet } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [adjustingWalletId, setAdjustingWalletId] = useState<string | null>(null);
  const [newBalanceInput, setNewBalanceInput] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const activeWallets = wallets.filter(w => !w.isArchived);
  const archivedWallets = wallets.filter(w => w.isArchived);

  const targetAdjustWallet = wallets.find(w => w.id === adjustingWalletId);

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingWalletId) return;
    const parsed = parseFloat(newBalanceInput);
    if (isNaN(parsed)) return;

    adjustWalletBalance(adjustingWalletId, parsed, 'Manual adjustment');
    setAdjustingWalletId(null);
    setNewBalanceInput('');
  };

  const openAdjust = (wId: string, current: number) => {
    setAdjustingWalletId(wId);
    setNewBalanceInput(current.toString());
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-slate-100">Wallets & Accounts</h1>
          <p className="text-xs text-on-surface-variant dark:text-slate-400">Manage cash, bank accounts, digital UPI wallets, and custom vaults</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Create Wallet</span>
        </button>
      </div>

      {/* Active Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeWallets.map(w => (
          <div key={w.id} className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-slate-700/50 text-primary dark:text-slate-200 flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-2xl">{w.icon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400 bg-surface-container-high dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    {w.type}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">{w.name}</h3>
                {w.accountNumber && (
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 font-mono">{w.accountNumber}</p>
                )}
              </div>

              <div className="pt-2 border-t border-outline-variant/60 dark:border-slate-800">
                <span className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider block">
                  Current Available Balance
                </span>
                <span className="text-2xl font-extrabold text-primary dark:text-slate-100 tabular-nums block mt-0.5">
                  {formatCurrency(w.currentBalance)}
                </span>
                <span className="text-xs text-on-surface-variant dark:text-slate-400 block mt-1">
                  Opening Balance: {formatCurrency(w.openingBalance)}
                </span>
              </div>
            </div>

            {/* Wallet Actions */}
            <div className="pt-4 border-t border-outline-variant/60 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => openAdjust(w.id, w.currentBalance)}
                className="text-xs font-bold text-primary dark:text-slate-300 hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">edit_note</span>
                <span>Adjust Balance</span>
              </button>

              <button
                onClick={() => archiveWallet(w.id)}
                className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 hover:text-expense flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">archive</span>
                <span>Archive</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Archived Wallets Section */}
      {archivedWallets.length > 0 && (
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-primary dark:text-slate-100">Archived Wallets ({archivedWallets.length})</h3>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="text-xs font-bold text-primary dark:text-slate-300 hover:underline"
            >
              {showArchived ? 'Hide' : 'Show Archived'}
            </button>
          </div>

          {showArchived && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {archivedWallets.map(w => (
                <div key={w.id} className="p-4 rounded-xl border border-outline-variant/60 dark:border-slate-700/60 bg-surface-container-low dark:bg-slate-900 flex justify-between items-center opacity-75">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface dark:text-slate-200">{w.name}</h4>
                    <p className="text-xs text-on-surface-variant dark:text-slate-400">Last Balance: {formatCurrency(w.currentBalance)}</p>
                  </div>
                  <button
                    onClick={() => restoreWallet(w.id)}
                    className="px-3 py-1.5 bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-colors"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Wallet Modal */}
      <AddWalletModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      {/* Balance Adjustment Modal */}
      <Modal isOpen={!!adjustingWalletId} onClose={() => setAdjustingWalletId(null)} title="Adjust Wallet Balance">
        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <p className="text-xs text-on-surface-variant dark:text-slate-400">
            Update the live balance for <strong>{targetAdjustWallet?.name}</strong>.
          </p>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase mb-1">New Balance</label>
            <input
              type="number"
              step="0.01"
              required
              value={newBalanceInput}
              onChange={(e) => setNewBalanceInput(e.target.value)}
              className="w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-xl font-bold text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none tabular-nums"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
            >
              Confirm Balance Adjustment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
