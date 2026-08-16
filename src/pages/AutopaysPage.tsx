import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConfirmAutopayModal, Modal } from '../components/Modals';
import { Autopay, AutopayFrequency } from '../types';

export const AutopaysPage: React.FC = () => {
  const { autopays, wallets, categories, addAutopay, formatCurrency } = useApp();

  const [selectedAutopay, setSelectedAutopay] = useState<Autopay | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Autopay form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<AutopayFrequency>('monthly');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories.find(c => c.type === 'expense')?.id || '');
  const [nextDueDate, setNextDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addAutopay({
      name,
      amount: parsedAmount,
      frequency,
      walletId,
      categoryId,
      nextDueDate,
    });

    setName('');
    setAmount('');
    setIsAddOpen(false);
  };

  const getWalletName = (wId: string) => wallets.find(w => w.id === wId)?.name || 'Wallet';
  const getCategoryName = (cId: string) => categories.find(c => c.id === cId)?.name || 'General';

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151c28] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recurring Autopays</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set payment reminders for subscriptions and bills. Payments are strictly confirmed manually before deduction.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Create Autopay</span>
        </button>
      </div>

      {/* Autopays Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {autopays.map(item => (
          <div key={item.id} className="bg-white dark:bg-[#151c28] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">event_repeat</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full">
                  {item.frequency}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-on-surface">{item.name}</h3>
                <p className="text-xs text-on-surface-variant">
                  {getCategoryName(item.categoryId)} • {getWalletName(item.walletId)}
                </p>
              </div>

              <div className="pt-2 border-t border-outline-variant/60">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
                  Recurring Amount
                </span>
                <span className="text-2xl font-extrabold text-expense tabular-nums block mt-0.5">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant block mt-1">
                  Next Due Date: <strong className="text-on-surface">{item.nextDueDate}</strong>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/60">
              <button
                onClick={() => setSelectedAutopay(item)}
                className="w-full bg-primary text-on-primary py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
              >
                Confirm Payment Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Payment Modal */}
      <ConfirmAutopayModal
        isOpen={!!selectedAutopay}
        onClose={() => setSelectedAutopay(null)}
        autopay={selectedAutopay}
      />

      {/* Add Autopay Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Recurring Autopay">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Autopay Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Netflix Subscription, WiFi Broadband"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2.5 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2.5 px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as AutopayFrequency)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2.5 px-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2.5 px-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {categories.filter(c => c.type === 'expense').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Primary Wallet</label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2.5 px-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {wallets.filter(w => !w.isArchived).map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">First Due Date</label>
            <input
              type="date"
              required
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2.5 px-4 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md"
            >
              Create Autopay Reminder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
