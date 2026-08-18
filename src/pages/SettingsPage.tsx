import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Currency } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, transactions, wallets, isDarkMode, toggleDarkMode, resetTransactionHistory } = useApp();
  const navigate = useNavigate();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const curr = e.target.value as Currency;
    const symbols: Record<Currency, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    updateUser({ currency: curr, currencySymbol: symbols[curr] });
  };

  const handleCSVExport = () => {
    const headers = ['ID', 'Date', 'Title', 'Type', 'Amount', 'WalletId', 'CategoryId', 'Tags', 'Source', 'Status'];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      t.walletId,
      t.categoryId || '',
      `"${t.tags.join(';')}"`,
      t.source,
      t.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fintrack_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullBackupExport = () => {
    const backupData = {
      user,
      wallets,
      transactions,
      exportTimestamp: new Date().toISOString()
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `fintrack_full_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to delete your entire transaction history?\n\nThis will permanently remove all recorded transactions.\nYour wallet balances will remain unchanged.')) {
      resetTransactionHistory();
    }
  };

  const handleRestartOnboarding = () => {
    if (confirm('⚠️ WARNING: Restarting onboarding will DELETE your entire transaction history.\n\nYour wallet balances will be preserved, but all transaction records will be permanently removed.\n\nAre you sure you want to continue?')) {
      resetTransactionHistory();
      updateUser({ isOnboarded: false });
      navigate('/onboarding');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm transition-colors">
        <h1 className="text-2xl font-bold text-primary dark:text-slate-100">Application Settings</h1>
        <p className="text-xs text-on-surface-variant dark:text-slate-400">Preferences, themes, Google account details, and data export tools</p>
      </div>

      {/* Preferences Section */}
      <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-primary dark:text-slate-100 border-b border-outline-variant/60 dark:border-slate-800 pb-3">Appearance & Currency</h3>

        {/* Theme Toggle with correct Sun/Moon icon rule */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-on-surface dark:text-slate-200">Interface Theme</h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400">
              Current mode: <strong>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</strong>
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 hover:bg-surface-container-highest dark:hover:bg-slate-700 text-on-surface dark:text-slate-200 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
            <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </button>
        </div>

        {/* Currency Selection */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/60 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-on-surface dark:text-slate-200">Display Currency</h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400">Default symbol used across dashboards and ledgers</p>
          </div>
          <select
            value={user.currency}
            onChange={handleCurrencyChange}
            className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-700/60 rounded-xl py-2 px-4 text-sm font-bold text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      {/* Account Info Section */}
      <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-primary dark:text-slate-100 border-b border-outline-variant/60 dark:border-slate-800 pb-3">Google Account Profile</h3>

        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border border-outline-variant dark:border-slate-700"
          />
          <div>
            <h4 className="text-base font-bold text-on-surface dark:text-slate-200">{user.name}</h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400">{user.email}</p>
            <p className="text-xs font-semibold text-primary dark:text-slate-300 mt-1">
              Status: <span className="capitalize">{user.professionalStatus}</span> {user.college ? `(${user.college})` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Data Export & Backup Section */}
      <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-primary dark:text-slate-100 border-b border-outline-variant/60 dark:border-slate-800 pb-3">Data Portability & Backup</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-outline-variant/60 dark:border-slate-700/50 bg-surface-container-low/30 dark:bg-slate-900/30 space-y-2">
            <h4 className="text-sm font-bold text-on-surface dark:text-slate-200">Export Transactions (CSV)</h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400">Download a spreadsheet CSV of all recorded transactions.</p>
            <button
              onClick={handleCSVExport}
              className="mt-2 w-full bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
            >
              Export CSV
            </button>
          </div>

          <div className="p-4 rounded-xl border border-outline-variant/60 dark:border-slate-700/50 bg-surface-container-low/30 dark:bg-slate-900/30 space-y-2">
            <h4 className="text-sm font-bold text-on-surface dark:text-slate-200">Full JSON Backup</h4>
            <p className="text-xs text-on-surface-variant dark:text-slate-400">Download a complete JSON database snapshot of your account.</p>
            <button
              onClick={handleFullBackupExport}
              className="mt-2 w-full bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
            >
              Export JSON Backup
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-4 border-t border-outline-variant/60 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-expense uppercase tracking-wider">Danger Zone</h4>
          
          {/* Onboarding - RED styling with warning */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-expense/5 dark:bg-red-950/30 p-4 rounded-xl border border-expense/20 dark:border-red-900/40">
            <div>
              <h5 className="text-sm font-bold text-expense">Re-run Onboarding Wizard</h5>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                ⚠️ This will <strong className="text-expense">delete your transaction history</strong> and re-configure your profile, currency, and wallets.
              </p>
            </div>
            <button
              onClick={handleRestartOnboarding}
              className="px-4 py-2 bg-expense hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shrink-0"
            >
              Restart Onboarding
            </button>
          </div>

          {/* Reset Data - transactions only */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-expense/5 dark:bg-red-950/30 p-4 rounded-xl border border-expense/20 dark:border-red-900/40">
            <div>
              <h5 className="text-sm font-bold text-expense">Clear Transaction History</h5>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">Permanently deletes all recorded transactions. Wallet balances remain unchanged.</p>
            </div>
            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-expense text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm shrink-0"
            >
              Reset Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
