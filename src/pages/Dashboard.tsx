import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddTransactionModal } from '../components/Modals';
import { TransactionType } from '../types';

export const Dashboard: React.FC = () => {
  const { user, wallets, transactions, categories, autopays, loansDues, formatCurrency } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('expense');

  // Active wallets & Net balance
  const activeWallets = wallets.filter(w => !w.isArchived);
  const netWorth = activeWallets.reduce((acc, w) => acc + w.currentBalance, 0);

  // Current month income & expense totals
  const currentMonthTx = transactions.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalIncome = currentMonthTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = currentMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netSavings = totalIncome - totalExpense;

  // Budget progress
  const budgetSpent = totalExpense;
  const budgetLimit = user.budgetAmount || 25000;
  const budgetPercent = Math.min(100, Math.round((budgetSpent / budgetLimit) * 100));

  const handleOpenAddModal = (type: TransactionType = 'expense') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const getCategoryDetails = (catId?: string) => {
    return categories.find(c => c.id === catId) || { name: 'General', icon: 'payments', color: '#64748b' };
  };

  const getWalletName = (wId: string) => {
    return wallets.find(w => w.id === wId)?.name || 'Wallet';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm transition-all">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">Overview</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary dark:text-slate-100 tracking-tight">
            Hello, {user.name} 👋
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">
            {user.professionalStatus === 'student' && user.college ? `Student at ${user.college}` : 'Zenith Personal Finance Platform'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenAddModal('expense')}
            className="bg-expense text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">remove_circle_outline</span>
            <span>Expense</span>
          </button>
          <button
            onClick={() => handleOpenAddModal('income')}
            className="bg-success text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add_circle_outline</span>
            <span>Income</span>
          </button>
          <button
            onClick={() => handleOpenAddModal('transfer')}
            className="bg-transfer text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">swap_horiz</span>
            <span>Transfer</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Requirement 8: "Total Net Worth" renamed to "Total" */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Total</span>
            <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-slate-700/50 text-primary dark:text-slate-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-extrabold text-primary dark:text-slate-100 tabular-nums tracking-tight">
              {formatCurrency(netWorth)}
            </h2>
            <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium mt-1 inline-block">
              Across {activeWallets.length} active wallets
            </span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Monthly Income</span>
            <div className="w-9 h-9 rounded-full bg-success/10 text-success flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">trending_up</span>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-extrabold text-success tabular-nums tracking-tight">
              +{formatCurrency(totalIncome)}
            </h2>
            <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium mt-1 inline-block">This month total</span>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Monthly Expenses</span>
            <div className="w-9 h-9 rounded-full bg-expense/10 text-expense flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">trending_down</span>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-extrabold text-expense tabular-nums tracking-tight">
              -{formatCurrency(totalExpense)}
            </h2>
            <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium mt-1 inline-block">This month total</span>
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Net Cash Savings</span>
            <div className="w-9 h-9 rounded-full bg-transfer/10 text-transfer flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">savings</span>
            </div>
          </div>
          <div className="mt-3">
            <h2 className={`text-2xl font-extrabold tabular-nums tracking-tight ${netSavings >= 0 ? 'text-primary dark:text-slate-100' : 'text-expense'}`}>
              {netSavings >= 0 ? '+' : ''}{formatCurrency(netSavings)}
            </h2>
            <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium mt-1 inline-block">Income minus expenses</span>
          </div>
        </div>
      </div>

      {/* Main Section: Budget Status & Wallets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Progress Card */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-primary dark:text-slate-100">Budget Status</h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 capitalize">{user.budgetPeriod} Budget Cap</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              budgetPercent >= 100 ? 'bg-expense/10 text-expense' : budgetPercent >= 80 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
            }`}>
              {budgetPercent}% Used
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-on-surface dark:text-slate-200">
              <span>{formatCurrency(budgetSpent)} Spent</span>
              <span>Limit: {formatCurrency(budgetLimit)}</span>
            </div>
            <div className="w-full h-3 bg-surface-container-high dark:bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetPercent >= 100 ? 'bg-expense' : budgetPercent >= 80 ? 'bg-warning' : 'bg-primary dark:bg-slate-100'
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-on-surface-variant dark:text-slate-400 border-t border-outline-variant/60 dark:border-slate-800 pt-3">
            {budgetLimit - budgetSpent >= 0
              ? `You have ${formatCurrency(budgetLimit - budgetSpent)} remaining in your ${user.budgetPeriod} budget limit.`
              : `You have exceeded your ${user.budgetPeriod} budget by ${formatCurrency(Math.abs(budgetLimit - budgetSpent))}.`}
          </p>
        </div>

        {/* Wallets Overview */}
        <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-primary dark:text-slate-100">My Wallets</h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">Real-time balances across your accounts</p>
            </div>
            <button
              onClick={() => handleOpenAddModal('transfer')}
              className="text-xs font-bold text-primary dark:text-slate-300 hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">swap_horiz</span>
              <span>Transfer Between Wallets</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {activeWallets.map(w => (
              <div
                key={w.id}
                className="p-4 rounded-xl border border-outline-variant dark:border-slate-700/60 bg-surface-container-low/40 dark:bg-slate-900/40 hover:bg-surface-container-low dark:hover:bg-slate-900 transition-all space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-slate-700/50 text-primary dark:text-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">{w.icon}</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant dark:text-slate-400 bg-surface-container-high dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {w.type}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface dark:text-slate-200 truncate">{w.name}</h4>
                  {w.accountNumber && <p className="text-[10px] text-on-surface-variant dark:text-slate-400 font-mono">{w.accountNumber}</p>}
                </div>
                <div className="pt-1 border-t border-outline-variant/40 dark:border-slate-800">
                  <span className="text-lg font-bold text-primary dark:text-slate-100 tabular-nums block">
                    {formatCurrency(w.currentBalance)}
                  </span>
                  <span className="text-[10px] text-on-surface-variant dark:text-slate-400">Opening: {formatCurrency(w.openingBalance)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section: Immutable Recent Transactions & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Immutable Recent Transactions */}
        <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-primary dark:text-slate-100">Recent Transactions</h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">Immutable audit feed of cash flows & transfers</p>
            </div>
            <a href="/transactions" className="text-xs font-bold text-primary dark:text-slate-300 hover:underline">
              View All History →
            </a>
          </div>

          <div className="divide-y divide-outline-variant/60 dark:divide-slate-800">
            {transactions.slice(0, 6).map(t => {
              const cat = getCategoryDetails(t.categoryId);
              return (
                <div key={t.id} className="py-3 flex items-center justify-between gap-3 hover:bg-surface-container-low/30 dark:hover:bg-slate-900/30 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                      style={{ backgroundColor: t.type === 'transfer' ? '#3b82f6' : cat.color }}
                    >
                      <span className="material-symbols-outlined">
                        {t.type === 'transfer' ? 'swap_horiz' : cat.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-on-surface dark:text-slate-200 truncate">{t.title}</h4>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-2">
                        <span>{getWalletName(t.walletId)}</span>
                        {t.type === 'transfer' && t.toWalletId && (
                          <span>→ {getWalletName(t.toWalletId)}</span>
                        )}
                        <span>• {new Date(t.date).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Requirement 3: Immutable ledger without delete buttons */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-base font-extrabold tabular-nums block ${
                        t.type === 'income' ? 'text-success' : t.type === 'expense' ? 'text-expense' : 'text-transfer'
                      }`}
                    >
                      {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}
                      {formatCurrency(t.amount)}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-slate-400">
                      {t.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Widgets */}
        <div className="space-y-6">
          {/* Upcoming Autopays */}
          <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-primary dark:text-slate-100">Upcoming Autopays</h3>
              <a href="/autopays" className="text-xs font-bold text-primary dark:text-slate-300 hover:underline">Manage</a>
            </div>

            <div className="space-y-3">
              {autopays.slice(0, 3).map(a => (
                <div key={a.id} className="p-3 rounded-xl border border-outline-variant/60 dark:border-slate-700/50 bg-surface-container-low/40 dark:bg-slate-900/40 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-on-surface dark:text-slate-200">{a.name}</h4>
                    <p className="text-[10px] text-on-surface-variant dark:text-slate-400">Due: {a.nextDueDate}</p>
                  </div>
                  <span className="text-sm font-bold text-expense tabular-nums">
                    {formatCurrency(a.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Loans & Dues */}
          <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-primary dark:text-slate-100">Loans & Dues Summary</h3>
              <a href="/loans" className="text-xs font-bold text-primary dark:text-slate-300 hover:underline">Manage</a>
            </div>

            <div className="space-y-3">
              {loansDues.slice(0, 2).map(l => (
                <div key={l.id} className="p-3 rounded-xl border border-outline-variant/60 dark:border-slate-700/50 bg-surface-container-low/40 dark:bg-slate-900/40 flex justify-between items-center">
                  <div>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      l.type === 'OWED_TO_ME' ? 'bg-success/10 text-success' : 'bg-expense/10 text-expense'
                    }`}>
                      {l.type === 'OWED_TO_ME' ? 'Owed to Me' : 'I Owe'}
                    </span>
                    <h4 className="text-xs font-bold text-on-surface dark:text-slate-200 mt-1">{l.personName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-on-surface dark:text-slate-200 tabular-nums block">
                      {formatCurrency(l.totalAmount - l.paidAmount)}
                    </span>
                    <span className="text-[10px] text-on-surface-variant dark:text-slate-400">Left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={modalType}
      />
    </div>
  );
};
