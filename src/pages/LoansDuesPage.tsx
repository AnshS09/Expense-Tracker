import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogRepaymentModal, Modal } from '../components/Modals';
import { LoanDue, LoanType } from '../types';

export const LoansDuesPage: React.FC = () => {
  const { loansDues, addLoanDue, settleLoanDue, formatCurrency } = useApp();

  const [activeTab, setActiveTab] = useState<'OWED_TO_ME' | 'OWED_BY_ME'>('OWED_TO_ME');
  const [selectedLoanForRepayment, setSelectedLoanForRepayment] = useState<LoanDue | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Loan Form state
  const [title, setTitle] = useState('');
  const [personName, setPersonName] = useState('');
  const [type, setType] = useState<LoanType>('OWED_TO_ME');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredLoans = loansDues.filter(l => l.type === activeTab);

  const totalOwedToMe = loansDues
    .filter(l => l.type === 'OWED_TO_ME' && l.status === 'ACTIVE')
    .reduce((acc, l) => acc + (l.totalAmount - l.paidAmount), 0);

  const totalOwedByMe = loansDues
    .filter(l => l.type === 'OWED_BY_ME' && l.status === 'ACTIVE')
    .reduce((acc, l) => acc + (l.totalAmount - l.paidAmount), 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(totalAmount);
    if (!title || !personName || isNaN(amount) || amount <= 0) return;

    addLoanDue({
      title,
      personName,
      type,
      totalAmount: amount,
      dueDate,
    });

    setTitle('');
    setPersonName('');
    setTotalAmount('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151c28] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Loans & Dues Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track money owed to you by friends and debts you owe to others</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add Loan / Due</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#151c28] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Money Owed To Me (Receivable)</span>
          <h2 className="text-2xl font-bold text-success tabular-nums mt-1">{formatCurrency(totalOwedToMe)}</h2>
        </div>

        <div className="bg-white dark:bg-[#151c28] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Money I Owe (Payable)</span>
          <h2 className="text-2xl font-bold text-expense tabular-nums mt-1">{formatCurrency(totalOwedByMe)}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#151c28] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex p-1 bg-surface-container-low dark:bg-slate-900 rounded-xl border border-outline-variant dark:border-slate-700/60 max-w-md">
          <button
            onClick={() => setActiveTab('OWED_TO_ME')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'OWED_TO_ME' ? 'bg-primary dark:bg-slate-100 text-on-primary dark:text-slate-900 shadow-sm' : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200'
            }`}
          >
            Owed To Me ({loansDues.filter(l => l.type === 'OWED_TO_ME').length})
          </button>
          <button
            onClick={() => setActiveTab('OWED_BY_ME')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'OWED_BY_ME' ? 'bg-primary dark:bg-slate-100 text-on-primary dark:text-slate-900 shadow-sm' : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200'
            }`}
          >
            Money I Owe ({loansDues.filter(l => l.type === 'OWED_BY_ME').length})
          </button>
        </div>

        {/* List Feed */}
        <div className="space-y-4 pt-2">
          {filteredLoans.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant dark:text-slate-400 text-xs font-semibold">
              No entries recorded under this category.
            </div>
          ) : (
            filteredLoans.map(loan => {
              const remaining = loan.totalAmount - loan.paidAmount;
              const percentPaid = Math.min(100, Math.round((loan.paidAmount / loan.totalAmount) * 100));

              return (
                <div key={loan.id} className="p-5 rounded-xl border border-outline-variant dark:border-slate-700/60 bg-surface-container-low/30 dark:bg-slate-800/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-on-surface dark:text-slate-100">{loan.title}</h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          loan.status === 'SETTLED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400">
                        Person: <strong className="text-on-surface dark:text-slate-200">{loan.personName}</strong> • Due: {loan.dueDate}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold text-primary dark:text-slate-100 tabular-nums block">
                        {formatCurrency(remaining)} Left
                      </span>
                      <span className="text-xs text-on-surface-variant dark:text-slate-400">
                        Total: {formatCurrency(loan.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant dark:text-slate-400">
                      <span>Paid: {formatCurrency(loan.paidAmount)} ({percentPaid}%)</span>
                      <span>Total: {formatCurrency(loan.totalAmount)}</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary dark:bg-emerald-500 transition-all duration-300" style={{ width: `${percentPaid}%` }} />
                    </div>
                  </div>

                  {/* Repayments History & Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-outline-variant/60 dark:border-slate-700/60">
                    <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">
                      {loan.repayments.length} repayment record(s)
                    </span>

                    {loan.status !== 'SETTLED' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedLoanForRepayment(loan)}
                          className="px-3 py-1.5 bg-surface-container-high dark:bg-slate-700 hover:bg-surface-container-highest dark:hover:bg-slate-600 text-on-surface dark:text-slate-200 text-xs font-bold rounded-lg transition-colors"
                        >
                          Partial Repayment
                        </button>
                        <button
                          onClick={() => settleLoanDue(loan.id)}
                          className="px-3 py-1.5 bg-primary dark:bg-slate-100 text-on-primary dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-300 transition-colors"
                        >
                          Settle In Full
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Repayment Modal */}
      <LogRepaymentModal
        isOpen={!!selectedLoanForRepayment}
        onClose={() => setSelectedLoanForRepayment(null)}
        loan={selectedLoanForRepayment}
      />

      {/* Add Loan Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Record New Loan or Due">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="flex p-1 bg-surface-container-low dark:bg-slate-900 rounded-xl border border-outline-variant dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setType('OWED_TO_ME')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                type === 'OWED_TO_ME' ? 'bg-success text-white' : 'text-on-surface-variant dark:text-slate-400'
              }`}
            >
              Money Owed To Me
            </button>
            <button
              type="button"
              onClick={() => setType('OWED_BY_ME')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                type === 'OWED_BY_ME' ? 'bg-expense text-white' : 'text-on-surface-variant dark:text-slate-400'
              }`}
            >
              Money I Owe
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase mb-1">Title / Purpose</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dinner Bill Split, Textbook Borrowing"
              className="w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase mb-1">Person Name</label>
            <input
              type="text"
              required
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g. Rohan Sharma"
              className="w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase mb-1">Total Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm font-bold text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase mb-1">Expected Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary dark:bg-slate-100 text-on-primary dark:text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-300 transition-all shadow-md"
            >
              Save Loan / Due Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
