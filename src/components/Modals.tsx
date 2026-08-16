import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WalletType, TransactionType, Autopay, LoanDue } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#151c28] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f17]/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-900 dark:text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
};

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWalletModal: React.FC<AddWalletModalProps> = ({ isOpen, onClose }) => {
  const { addWallet } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<WalletType>('bank');
  const [openingBalance, setOpeningBalance] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const walletIcons: Record<WalletType, string> = {
    bank: 'account_balance',
    cash: 'payments',
    digital: 'account_balance_wallet',
    custom: 'credit_card'
  };

  const walletColors: Record<WalletType, string> = {
    bank: '#0f172a',
    cash: '#10b981',
    digital: '#00baf2',
    custom: '#8b5cf6'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(openingBalance) || 0;
    if (!name) return;

    addWallet({
      name,
      type,
      openingBalance: balance,
      icon: walletIcons[type],
      color: walletColors[type],
      accountNumber: accountNumber ? `•••• ${accountNumber.slice(-4)}` : undefined
    });

    setName('');
    setOpeningBalance('');
    setAccountNumber('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Wallet">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Wallet Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. HDFC Salary, Pocket Cash, Paytm"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Wallet Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as WalletType)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="bank">Bank Account</option>
            <option value="cash">Cash Wallet</option>
            <option value="digital">Digital Wallet / UPI</option>
            <option value="custom">Custom Wallet</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Opening Balance
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-lg font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none tabular-nums"
          />
        </div>

        {type === 'bank' && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Account Number (Last 4 digits - optional)
            </label>
            <input
              type="text"
              maxLength={4}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="4892"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-3 rounded-xl font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
          >
            Create Wallet
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
}) => {
  const { wallets, categories, addTransaction, formatCurrency } = useApp();

  const [type, setType] = useState<TransactionType>(defaultType);

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
    }
  }, [isOpen, defaultType]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [toWalletId, setToWalletId] = useState(wallets[1]?.id || wallets[0]?.id || '');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [tagsInput, setTagsInput] = useState('');

  const activeCategories = categories.filter(c => c.type === (type === 'income' ? 'income' : 'expense') && !c.isArchived);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!walletId) return;

    if (type === 'transfer' && (!toWalletId || toWalletId === walletId)) {
      alert('Please select a different destination wallet for transfer');
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    addTransaction({
      title: title || (type === 'transfer' ? 'Wallet Transfer' : 'Transaction'),
      description,
      amount: parsedAmount,
      type,
      walletId,
      toWalletId: type === 'transfer' ? toWalletId : undefined,
      categoryId: type !== 'transfer' ? (categoryId || (type === 'income' ? 'cat_inc_other' : 'cat_exp_other')) : undefined,
      date,
      tags
    });

    setTitle('');
    setAmount('');
    setDescription('');
    setTagsInput('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              type === 'expense'
                ? 'bg-expense text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              type === 'income'
                ? 'bg-success text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType('transfer')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              type === 'transfer'
                ? 'bg-transfer text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Transfer
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-2xl font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none transition-all tabular-nums"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Title / Merchant
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'expense' ? 'e.g. Grocery Store, Rent' : type === 'income' ? 'e.g. Stipend, Salary' : 'e.g. ATM Cash Withdrawal'}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          />
        </div>

        {/* Wallets & Categories */}
        {type === 'transfer' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                From Wallet
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {wallets.filter(w => !w.isArchived).map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatCurrency(w.currentBalance)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                To Wallet
              </label>
              <select
                value={toWalletId}
                onChange={(e) => setToWalletId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {wallets.filter(w => !w.isArchived).map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatCurrency(w.currentBalance)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Wallet
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {wallets.filter(w => !w.isArchived).map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatCurrency(w.currentBalance)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Category</option>
                {activeCategories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Date & Time */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Date & Time
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. Monthly, Groceries, Party"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Notes / Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Add optional notes..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Form Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-3 rounded-xl font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
          >
            Save {type.toUpperCase()}
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface ConfirmAutopayModalProps {
  isOpen: boolean;
  onClose: () => void;
  autopay: Autopay | null;
}

export const ConfirmAutopayModal: React.FC<ConfirmAutopayModalProps> = ({
  isOpen,
  onClose,
  autopay,
}) => {
  const { wallets, confirmAutopay, formatCurrency } = useApp();
  const [walletId, setWalletId] = useState(autopay?.walletId || wallets[0]?.id || '');

  if (!autopay) return null;

  const handleConfirm = () => {
    confirmAutopay(autopay.id, walletId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Recurring Payment">
      <div className="space-y-4">
        <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{autopay.name}</span>
            <span className="font-extrabold text-expense text-lg">{formatCurrency(autopay.amount)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Frequency:</span>
            <span className="capitalize font-semibold">{autopay.frequency}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Due Date:</span>
            <span className="font-semibold">{autopay.nextDueDate}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Deduct From Wallet
          </label>
          <select
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
          >
            {wallets.filter(w => !w.isArchived).map(w => (
              <option key={w.id} value={w.id}>
                {w.name} ({formatCurrency(w.currentBalance)})
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Confirming will record an Expense transaction and advance the next due date automatically.
        </p>

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary rounded-xl font-bold hover:opacity-90 transition-colors shadow-md"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface LogRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanDue | null;
}

export const LogRepaymentModal: React.FC<LogRepaymentModalProps> = ({ isOpen, onClose, loan }) => {
  const { wallets, logRepayment, formatCurrency } = useApp();

  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [note, setNote] = useState('');

  if (!loan) return null;

  const remaining = loan.totalAmount - loan.paidAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    logRepayment(loan.id, parsedAmount, walletId || undefined, note);
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Repayment - ${loan.personName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <div className="flex justify-between text-slate-900 dark:text-slate-100">
            <span className="font-semibold">{loan.title}</span>
            <span className="font-bold">{formatCurrency(loan.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Already Settled:</span>
            <span>{formatCurrency(loan.paidAmount)}</span>
          </div>
          <div className="flex justify-between text-primary dark:text-slate-200 font-bold pt-1 border-t border-slate-200 dark:border-slate-800">
            <span>Remaining Due:</span>
            <span>{formatCurrency(remaining)}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Repayment Amount
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              max={remaining}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-lg font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none tabular-nums"
            />
            <button
              type="button"
              onClick={() => setAmount(remaining.toString())}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Full ({formatCurrency(remaining)})
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Reflect in Wallet (Optional)
          </label>
          <select
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">Do not update wallet</option>
            {wallets.filter(w => !w.isArchived).map(w => (
              <option key={w.id} value={w.id}>
                {w.name} ({formatCurrency(w.currentBalance)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Payment Note (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. GPay UPI transfer, Cash payment"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-3 rounded-xl font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
          >
            Log Repayment
          </button>
        </div>
      </form>
    </Modal>
  );
};
