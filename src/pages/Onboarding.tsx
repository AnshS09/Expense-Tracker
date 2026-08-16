import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProfessionalStatus, Currency, BudgetPeriod, WalletType } from '../types';

interface OnboardingWalletItem {
  id: string;
  name: string;
  type: WalletType;
  openingBalance: number;
  icon: string;
  color: string;
}

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding, user } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Personal Information
  const [name, setName] = useState(user.name || '');
  const [professionalStatus, setProfessionalStatus] = useState<ProfessionalStatus>('student');
  const [college, setCollege] = useState(user.college || '');

  // Step 2: Financial Preferences
  const [currency, setCurrency] = useState<Currency>('INR');
  const [budgetPeriod, setBudgetPeriod] = useState<BudgetPeriod>('monthly');
  const [budgetAmount, setBudgetAmount] = useState('25000');

  // Step 3: Multi-Wallet Setup
  const [wallets, setWallets] = useState<OnboardingWalletItem[]>([
    {
      id: 'w_init_1',
      name: 'Primary Bank Account',
      type: 'bank',
      openingBalance: 25000,
      icon: 'account_balance',
      color: '#0f172a',
    },
  ]);

  // Temp form for adding/editing a wallet in Step 3
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState<WalletType>('bank');
  const [openingBalance, setOpeningBalance] = useState('');
  const [walletIcon, setWalletIcon] = useState('account_balance');

  const currencySymbols: Record<Currency, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const walletTypeLabels: Record<WalletType, string> = {
    bank: 'Bank Account',
    cash: 'Cash',
    digital: 'Digital Wallet',
    custom: 'Other',
  };

  const iconOptions = [
    { icon: 'account_balance', label: 'Bank' },
    { icon: 'payments', label: 'Cash' },
    { icon: 'account_balance_wallet', label: 'Digital' },
    { icon: 'credit_card', label: 'Card' },
    { icon: 'smartphone', label: 'UPI' },
    { icon: 'savings', label: 'Savings' },
  ];

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletName.trim()) return;

    const parsedBal = parseFloat(openingBalance) || 0;

    if (editingWalletId) {
      setWallets(prev =>
        prev.map(w =>
          w.id === editingWalletId
            ? {
                ...w,
                name: walletName,
                type: walletType,
                openingBalance: parsedBal,
                icon: walletIcon,
              }
            : w
        )
      );
      setEditingWalletId(null);
    } else {
      const newW: OnboardingWalletItem = {
        id: 'w_temp_' + Date.now(),
        name: walletName,
        type: walletType,
        openingBalance: parsedBal,
        icon: walletIcon,
        color: walletType === 'bank' ? '#0f172a' : walletType === 'cash' ? '#10b981' : '#00baf2',
      };
      setWallets(prev => [...prev, newW]);
    }

    // Reset wallet form
    setWalletName('');
    setWalletType('bank');
    setOpeningBalance('');
    setWalletIcon('account_balance');
  };

  const handleStartEdit = (w: OnboardingWalletItem) => {
    setEditingWalletId(w.id);
    setWalletName(w.name);
    setWalletType(w.type);
    setOpeningBalance(w.openingBalance.toString());
    setWalletIcon(w.icon);
  };

  const handleDeleteWallet = (id: string) => {
    if (wallets.length <= 1) {
      alert('At least one wallet is required.');
      return;
    }
    setWallets(prev => prev.filter(w => w.id !== id));
    if (editingWalletId === id) {
      setEditingWalletId(null);
      setWalletName('');
      setOpeningBalance('');
    }
  };

  const handleFinishOnboarding = () => {
    const parsedBudget = budgetAmount ? parseFloat(budgetAmount) : 0;

    completeOnboarding(
      {
        name,
        professionalStatus,
        college: professionalStatus === 'student' ? college : undefined,
        currency,
        currencySymbol: currencySymbols[currency],
        budgetPeriod,
        budgetAmount: parsedBudget,
      },
      wallets.map(w => ({
        name: w.name,
        type: w.type,
        openingBalance: w.openingBalance,
        icon: w.icon,
        color: w.color,
      }))
    );

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-[#0b0f17] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-800 dark:bg-[#151c28] border border-slate-700 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header & Progress Bar */}
        <div className="space-y-3 border-b border-slate-700 dark:border-slate-800 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Setup Your Account</h1>
              <p className="text-xs text-slate-400">Step {step} of 4 — {step === 1 ? 'Personal Information' : step === 2 ? 'Financial Preferences' : step === 3 ? 'Wallet Setup' : 'Review & Confirm'}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700/60 text-xs font-semibold">
              <span className="text-emerald-400 font-bold">{step * 25}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/50 dark:bg-slate-900 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Professional Status <span className="text-rose-400">*</span>
              </label>
              <select
                value={professionalStatus}
                onChange={(e) => setProfessionalStatus(e.target.value as ProfessionalStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="working_professional">Working Professional</option>
                <option value="self_employed">Self-employed</option>
                <option value="other">Other</option>
              </select>
            </div>

            {professionalStatus === 'student' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  College / Institution (Optional)
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Stanford University, IIT Delhi"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-extrabold transition-all shadow-md mt-6"
            >
              Continue to Financial Preferences →
            </button>
          </form>
        )}

        {/* STEP 2: Financial Preferences */}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Primary Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Budget Tracking Period
                </label>
                <select
                  value={budgetPeriod}
                  onChange={(e) => setBudgetPeriod(e.target.value as BudgetPeriod)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Target Budget Amount ({currencySymbols[currency]}) <span className="text-slate-400 lowercase font-normal">(optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="25000"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-lg font-bold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none tabular-nums placeholder:text-slate-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Set an optional spending ceiling for your budget tracking period.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-extrabold transition-all shadow-md"
              >
                Continue to Wallet Setup →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Wallet Setup (Multi-Wallet) */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Added Wallets List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Wallets ({wallets.length})</h3>
                <span className="text-[11px] text-slate-400">Add cash, bank, or digital wallets</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {wallets.map(w => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-900/80 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
                        <span className="material-symbols-outlined text-lg">{w.icon}</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{w.name}</div>
                        <div className="text-[11px] text-slate-400 capitalize">{walletTypeLabels[w.type]}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xs font-extrabold text-emerald-400 tabular-nums">
                        {currencySymbols[currency]}{w.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(w)}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                        title="Edit Wallet"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteWallet(w.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Wallet"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add / Edit Wallet Form */}
            <form onSubmit={handleSaveWallet} className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/80 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400">
                {editingWalletId ? 'Edit Wallet' : '+ Add Another Wallet'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Wallet Name</label>
                  <input
                    type="text"
                    required
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    placeholder="e.g. Cash Wallet, Paytm UPI"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Wallet Type</label>
                  <select
                    value={walletType}
                    onChange={(e) => setWalletType(e.target.value as WalletType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Account</option>
                    <option value="digital">Digital Wallet</option>
                    <option value="custom">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Opening Balance ({currencySymbols[currency]})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Icon</label>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {iconOptions.map(opt => (
                      <button
                        type="button"
                        key={opt.icon}
                        onClick={() => setWalletIcon(opt.icon)}
                        className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                          walletIcon === opt.icon
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                            : 'border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{opt.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                {editingWalletId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWalletId(null);
                      setWalletName('');
                      setOpeningBalance('');
                    }}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  {editingWalletId ? 'Update Wallet' : 'Save Wallet to List'}
                </button>
              </div>
            </form>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-2/3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-extrabold transition-all shadow-md"
              >
                Review Summary →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                Summary Review
              </h3>

              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-bold text-white text-sm">{name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Professional Status</span>
                  <span className="font-semibold text-white capitalize">{professionalStatus.replace('_', ' ')}</span>
                </div>
                {professionalStatus === 'student' && college && (
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">College / Institution</span>
                    <span className="font-semibold text-white">{college}</span>
                  </div>
                )}
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-3 gap-2 text-xs border-t border-slate-800 pt-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Currency</span>
                  <span className="font-bold text-emerald-400">{currency} ({currencySymbols[currency]})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Budget Cycle</span>
                  <span className="font-semibold text-white capitalize">{budgetPeriod}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Budget Cap</span>
                  <span className="font-bold text-white">{budgetAmount ? `${currencySymbols[currency]}${parseFloat(budgetAmount).toLocaleString('en-IN')}` : 'None'}</span>
                </div>
              </div>

              {/* Wallets Summary */}
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <span className="text-slate-400 block text-[11px] font-semibold">Configured Wallets ({wallets.length})</span>
                <div className="space-y-1.5">
                  {wallets.map(w => (
                    <div key={w.id} className="flex justify-between items-center bg-slate-800/80 px-3 py-2 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-emerald-400">{w.icon}</span>
                        <span className="font-semibold text-white">{w.name}</span>
                      </div>
                      <span className="font-bold text-emerald-400 tabular-nums">
                        {currencySymbols[currency]}{w.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-1/3 py-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-2/3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-extrabold transition-all shadow-md"
              >
                Finish & Go to Dashboard 🎉
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
