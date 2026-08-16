import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddTransactionModal } from '../components/Modals';
import { TransactionType } from '../types';

export const TransactionsPage: React.FC = () => {
  const { transactions, wallets, categories, formatCurrency } = useApp();

  const [activeSubsection, setActiveSubsection] = useState<'full' | 'monthly'>('full');
  
  // Filters for Full History
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWallet, setSelectedWallet] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Month selector for Monthly History (YYYY-MM format)
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('expense');

  // Unique months available in transaction records
  const availableMonths: string[] = Array.from(
    new Set(transactions.map(t => t.date.slice(0, 7)))
  ).sort().reverse();
  if (!availableMonths.includes(currentMonthStr)) {
    availableMonths.unshift(currentMonthStr);
  }

  // Full History Filtering
  const fullHistoryFiltered = transactions.filter(t => {
    if (selectedType !== 'all' && t.type !== selectedType) return false;
    if (selectedWallet !== 'all' && t.walletId !== selectedWallet && t.toWalletId !== selectedWallet) return false;
    if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchTags = t.tags.some(tag => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const fullHistorySorted = [...fullHistoryFiltered].sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'amount_desc') return b.amount - a.amount;
    if (sortBy === 'amount_asc') return a.amount - b.amount;
    return 0;
  });

  // Monthly History Filtering
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));
  const monthlyInflow = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const monthlyOutflow = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const monthlyNet = monthlyInflow - monthlyOutflow;

  const getCategoryDetails = (catId?: string) => {
    return categories.find(c => c.id === catId) || { name: 'Transfer / General', icon: 'swap_horiz', color: '#3b82f6' };
  };

  const getWalletName = (wId: string) => {
    return wallets.find(w => w.id === wId)?.name || 'Wallet';
  };

  const openAdd = (t: TransactionType) => {
    setModalType(t);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-slate-100">Transaction History</h1>
          <p className="text-xs text-on-surface-variant dark:text-slate-400">
            Immutable audit record of all account cash flows & transfers (cannot be deleted to protect wallet balance accuracy)
          </p>
        </div>
        <button
          onClick={() => openAdd('expense')}
          className="bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>New Transaction</span>
        </button>
      </div>

      {/* Subsection Tab Bar: Full History vs Monthly History */}
      <div className="flex p-1.5 bg-surface-container-low dark:bg-[#151c28] rounded-2xl border border-outline-variant dark:border-slate-800 max-w-md">
        <button
          onClick={() => setActiveSubsection('full')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubsection === 'full'
              ? 'bg-primary dark:bg-slate-100 text-on-primary dark:text-slate-900 shadow-sm'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm">history</span>
          <span>Full History ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubsection('monthly')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubsection === 'monthly'
              ? 'bg-primary dark:bg-slate-100 text-on-primary dark:text-slate-900 shadow-sm'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          <span>Monthly History</span>
        </button>
      </div>

      {/* SUBSECTION 1: FULL HISTORY */}
      {activeSubsection === 'full' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-surface-container-lowest dark:bg-[#151c28] p-4 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 text-sm">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, tags..."
                  className="w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2 pl-9 pr-3 text-xs text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2 px-3 text-xs text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>

              {/* Wallet Filter */}
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2 px-3 text-xs text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="all">All Wallets</option>
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2 px-3 text-xs text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2 px-3 text-xs font-semibold text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="amount_desc">Highest Amount</option>
                <option value="amount_asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Full History Feed */}
          <div className="bg-surface-container-lowest dark:bg-[#151c28] rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-outline-variant/60 dark:divide-slate-800">
            {fullHistorySorted.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant dark:text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 text-outline">receipt_long</span>
                <p className="text-sm font-semibold">No transactions match your search filter.</p>
              </div>
            ) : (
              fullHistorySorted.map(t => {
                const cat = getCategoryDetails(t.categoryId);
                return (
                  <div key={t.id} className="p-4 flex items-center justify-between gap-4 hover:bg-surface-container-low/40 dark:hover:bg-slate-900/40 transition-colors">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                        style={{ backgroundColor: t.type === 'transfer' ? '#3b82f6' : cat.color }}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {t.type === 'transfer' ? 'swap_horiz' : cat.icon}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-on-surface dark:text-slate-200 truncate">{t.title}</h3>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            t.type === 'income' ? 'bg-success/10 text-success' : t.type === 'expense' ? 'bg-expense/10 text-expense' : 'bg-transfer/10 text-transfer'
                          }`}>
                            {t.type}
                          </span>
                        </div>

                        <p className="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{getWalletName(t.walletId)}</span>
                          {t.type === 'transfer' && t.toWalletId && (
                            <span>→ {getWalletName(t.toWalletId)}</span>
                          )}
                          <span>• {new Date(t.date).toLocaleString()}</span>
                        </p>

                        {t.tags.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {t.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-surface-container-high dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Immutable Transaction Record Amount */}
                    <div className="text-right shrink-0">
                      <span className={`text-lg font-extrabold tabular-nums block ${
                        t.type === 'income' ? 'text-success' : t.type === 'expense' ? 'text-expense' : 'text-transfer'
                      }`}>
                        {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}
                        {formatCurrency(t.amount)}
                      </span>
                      <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">
                        Source: {t.source}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBSECTION 2: MONTHLY HISTORY */}
      {activeSubsection === 'monthly' && (
        <div className="space-y-6">
          {/* Month Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-primary dark:text-slate-100">Monthly Audit Log</h2>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">Select a billing period to analyze monthly cash flow</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400">Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2 px-4 text-xs font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {availableMonths.map(m => (
                  <option key={m} value={m}>
                    {new Date(m + '-01').toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Monthly Inflow</span>
              <h3 className="text-2xl font-extrabold text-success tabular-nums mt-1">+{formatCurrency(monthlyInflow)}</h3>
            </div>
            <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Monthly Outflow</span>
              <h3 className="text-2xl font-extrabold text-expense tabular-nums mt-1">-{formatCurrency(monthlyOutflow)}</h3>
            </div>
            <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Net Month Balance</span>
              <h3 className={`text-2xl font-extrabold tabular-nums mt-1 ${monthlyNet >= 0 ? 'text-primary dark:text-slate-100' : 'text-expense'}`}>
                {monthlyNet >= 0 ? '+' : ''}{formatCurrency(monthlyNet)}
              </h3>
            </div>
          </div>

          {/* Monthly Transactions Feed */}
          <div className="bg-surface-container-lowest dark:bg-[#151c28] rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-outline-variant/60 dark:divide-slate-800">
            {monthlyTransactions.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant dark:text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 text-outline">calendar_today</span>
                <p className="text-sm font-semibold">No transactions found for {selectedMonth}.</p>
              </div>
            ) : (
              monthlyTransactions.map(t => {
                const cat = getCategoryDetails(t.categoryId);
                return (
                  <div key={t.id} className="p-4 flex items-center justify-between gap-4 hover:bg-surface-container-low/40 dark:hover:bg-slate-900/40 transition-colors">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
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
                          {t.type === 'transfer' && t.toWalletId && <span>→ {getWalletName(t.toWalletId)}</span>}
                          <span>• {new Date(t.date).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-base font-extrabold tabular-nums block ${
                        t.type === 'income' ? 'text-success' : t.type === 'expense' ? 'text-expense' : 'text-transfer'
                      }`}>
                        {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}
                        {formatCurrency(t.amount)}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-slate-400">
                        {t.type}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={modalType}
      />
    </div>
  );
};
