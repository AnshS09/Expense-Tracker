import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile, Wallet, Category, Transaction, LoanDue, Autopay } from '../types';
import { initialUser, initialWallets, defaultCategories, initialTransactions, initialLoansDues, initialAutopays } from '../mock/initialData';

interface AppContextType {
  user: UserProfile;
  updateUser: (fields: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>, initialWalletsList: Omit<Wallet, 'id' | 'currentBalance' | 'isArchived'>[]) => void;
  
  // Wallets
  wallets: Wallet[];
  addWallet: (wallet: Omit<Wallet, 'id' | 'currentBalance' | 'isArchived'>) => void;
  updateWallet: (id: string, fields: Partial<Wallet>) => void;
  adjustWalletBalance: (id: string, newBalance: number, reason?: string) => void;
  archiveWallet: (id: string) => void;
  restoreWallet: (id: string) => void;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'isCustom' | 'isArchived'>) => void;
  archiveCategory: (id: string) => void;

  // Transactions (Immutable History Engine)
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'source' | 'status'>) => void;

  // Loans & Dues
  loansDues: LoanDue[];
  addLoanDue: (item: Omit<LoanDue, 'id' | 'paidAmount' | 'status' | 'repayments'>) => void;
  logRepayment: (loanId: string, amount: number, walletId?: string, note?: string) => void;
  settleLoanDue: (loanId: string, walletId?: string) => void;

  // Autopays
  autopays: Autopay[];
  addAutopay: (item: Omit<Autopay, 'id' | 'status'>) => void;
  confirmAutopay: (autopayId: string, walletId?: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Helpers
  formatCurrency: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fintrack_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('fintrack_wallets');
    return saved ? JSON.parse(saved) : initialWallets;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('fintrack_categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fintrack_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [loansDues, setLoansDues] = useState<LoanDue[]>(() => {
    const saved = localStorage.getItem('fintrack_loans');
    return saved ? JSON.parse(saved) : initialLoansDues;
  });

  const [autopays, setAutopays] = useState<Autopay[]>(() => {
    const saved = localStorage.getItem('fintrack_autopays');
    return saved ? JSON.parse(saved) : initialAutopays;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('fintrack_theme');
    if (savedTheme) return savedTheme === 'dark';
    return true; // Default to dark mode
  });

  const { session } = useAuth();

  // Clear data when user logs out
  useEffect(() => {
    if (!session) {
      setUser(initialUser);
      setWallets(initialWallets);
      setCategories(defaultCategories);
      setTransactions(initialTransactions);
      setLoansDues(initialLoansDues);
      setAutopays(initialAutopays);
      
      localStorage.removeItem('fintrack_user');
      localStorage.removeItem('fintrack_wallets');
      localStorage.removeItem('fintrack_transactions');
      localStorage.removeItem('fintrack_loans');
      localStorage.removeItem('fintrack_autopays');
      // Keep theme & categories
    }
  }, [session]);

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('fintrack_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('fintrack_wallets', JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem('fintrack_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('fintrack_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('fintrack_loans', JSON.stringify(loansDues)); }, [loansDues]);
  useEffect(() => { localStorage.setItem('fintrack_autopays', JSON.stringify(autopays)); }, [autopays]);
  
  useEffect(() => {
    localStorage.setItem('fintrack_theme', isDarkMode ? 'dark' : 'light');
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const updateUser = (fields: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...fields }));
  };

  const completeOnboarding = (
    data: Partial<UserProfile>,
    initialWalletsList: Omit<Wallet, 'id' | 'currentBalance' | 'isArchived'>[]
  ) => {
    const createdWallets: Wallet[] = initialWalletsList.map((w, idx) => ({
      ...w,
      id: 'w_' + Date.now() + '_' + idx,
      currentBalance: w.openingBalance,
      isArchived: false,
    }));

    if (createdWallets.length > 0) {
      setWallets(createdWallets);
    }
    setUser(prev => ({
      ...prev,
      ...data,
      isOnboarded: true,
    }));
  };

  const addWallet = (wallet: Omit<Wallet, 'id' | 'currentBalance' | 'isArchived'>) => {
    const newWallet: Wallet = {
      ...wallet,
      id: 'w_' + Date.now(),
      currentBalance: wallet.openingBalance,
      isArchived: false,
    };
    setWallets(prev => [...prev, newWallet]);
  };

  const updateWallet = (id: string, fields: Partial<Wallet>) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, ...fields } : w));
  };

  const adjustWalletBalance = (id: string, newBalance: number, _reason?: string) => {
    setWallets(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, currentBalance: newBalance };
      }
      return w;
    }));
  };

  const archiveWallet = (id: string) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, isArchived: true } : w));
  };

  const restoreWallet = (id: string) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, isArchived: false } : w));
  };

  const addCategory = (cat: Omit<Category, 'id' | 'isCustom' | 'isArchived'>) => {
    const newCategory: Category = {
      ...cat,
      id: 'cat_custom_' + Date.now(),
      isCustom: true,
      isArchived: false,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const archiveCategory = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isArchived: true } : c));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'source' | 'status'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now(),
      source: 'manual',
      status: 'confirmed',
    };

    setTransactions(prev => [newTx, ...prev]);

    // Wallet balance impact rules
    if (tx.type === 'expense') {
      setWallets(prev => prev.map(w => w.id === tx.walletId ? { ...w, currentBalance: w.currentBalance - tx.amount } : w));
    } else if (tx.type === 'income') {
      setWallets(prev => prev.map(w => w.id === tx.walletId ? { ...w, currentBalance: w.currentBalance + tx.amount } : w));
    } else if (tx.type === 'transfer' && tx.toWalletId) {
      setWallets(prev => prev.map(w => {
        if (w.id === tx.walletId) return { ...w, currentBalance: w.currentBalance - tx.amount };
        if (w.id === tx.toWalletId) return { ...w, currentBalance: w.currentBalance + tx.amount };
        return w;
      }));
    }
  };

  const addLoanDue = (item: Omit<LoanDue, 'id' | 'paidAmount' | 'status' | 'repayments'>) => {
    const newLoan: LoanDue = {
      ...item,
      id: 'loan_' + Date.now(),
      paidAmount: 0,
      status: 'ACTIVE',
      repayments: []
    };
    setLoansDues(prev => [newLoan, ...prev]);
  };

  const logRepayment = (loanId: string, amount: number, walletId?: string, note?: string) => {
    const targetLoan = loansDues.find(l => l.id === loanId);
    if (!targetLoan) return;

    const repaymentItem = {
      id: 'rep_' + Date.now(),
      amount,
      date: new Date().toISOString().split('T')[0],
      walletId,
      note,
    };

    const newPaidAmount = targetLoan.paidAmount + amount;
    const isSettled = newPaidAmount >= targetLoan.totalAmount;

    setLoansDues(prev => prev.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          paidAmount: newPaidAmount,
          status: isSettled ? 'SETTLED' : 'ACTIVE',
          repayments: [...l.repayments, repaymentItem]
        };
      }
      return l;
    }));

    if (walletId) {
      if (targetLoan.type === 'OWED_BY_ME') {
        // Paying money I owe -> Expense (wallet balance decreases)
        addTransaction({
          title: `Repayment for ${targetLoan.title}`,
          description: `Repayment to ${targetLoan.personName}`,
          amount,
          type: 'expense',
          walletId,
          categoryId: 'cat_exp_other',
          date: new Date().toISOString(),
          tags: ['Repayment', 'Loan']
        });
      } else {
        // Received money owed to me -> Income (wallet balance increases)
        addTransaction({
          title: `Received Repayment from ${targetLoan.personName}`,
          description: `Repayment for ${targetLoan.title}`,
          amount,
          type: 'income',
          walletId,
          categoryId: 'cat_inc_refund',
          date: new Date().toISOString(),
          tags: ['Repayment', 'Loan']
        });
      }
    }
  };

  const settleLoanDue = (loanId: string, walletId?: string) => {
    const targetLoan = loansDues.find(l => l.id === loanId);
    if (!targetLoan) return;
    const remainingAmount = targetLoan.totalAmount - targetLoan.paidAmount;
    if (remainingAmount > 0) {
      logRepayment(loanId, remainingAmount, walletId, 'Full settlement');
    }
  };

  const addAutopay = (item: Omit<Autopay, 'id' | 'status'>) => {
    const newAutopay: Autopay = {
      ...item,
      id: 'auto_' + Date.now(),
      status: 'UPCOMING'
    };
    setAutopays(prev => [...prev, newAutopay]);
  };

  const confirmAutopay = (autopayId: string, walletIdOverride?: string) => {
    const autopay = autopays.find(a => a.id === autopayId);
    if (!autopay) return;

    const targetWalletId = walletIdOverride || autopay.walletId;

    addTransaction({
      title: `Autopay: ${autopay.name}`,
      description: `Recurring payment confirmed for ${autopay.name}`,
      amount: autopay.amount,
      type: 'expense',
      walletId: targetWalletId,
      categoryId: autopay.categoryId,
      date: new Date().toISOString(),
      tags: ['Autopay', 'Recurring']
    });

    const currentDueDate = new Date(autopay.nextDueDate);
    if (autopay.frequency === 'weekly') currentDueDate.setDate(currentDueDate.getDate() + 7);
    else if (autopay.frequency === 'monthly') currentDueDate.setMonth(currentDueDate.getMonth() + 1);
    else if (autopay.frequency === 'quarterly') currentDueDate.setMonth(currentDueDate.getMonth() + 3);
    else if (autopay.frequency === 'yearly') currentDueDate.setFullYear(currentDueDate.getFullYear() + 1);

    const nextDueDateStr = currentDueDate.toISOString().split('T')[0];

    setAutopays(prev => prev.map(a => a.id === autopayId ? { ...a, nextDueDate: nextDueDateStr } : a));
  };

  const formatCurrency = (amount: number) => {
    const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    const sym = symbols[user.currency] || user.currencySymbol || '₹';
    return `${sym}${amount.toLocaleString('en-IN')}`;
  };

  return (
    <AppContext.Provider value={{
      user, updateUser, completeOnboarding,
      wallets, addWallet, updateWallet, adjustWalletBalance, archiveWallet, restoreWallet,
      categories, addCategory, archiveCategory,
      transactions, addTransaction,
      loansDues, addLoanDue, logRepayment, settleLoanDue,
      autopays, addAutopay, confirmAutopay,
      isDarkMode, toggleDarkMode,
      formatCurrency
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
