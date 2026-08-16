export type ProfessionalStatus = 'student' | 'working_professional' | 'self_employed' | 'other';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';
export type BudgetPeriod = 'weekly' | 'monthly';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  professionalStatus: ProfessionalStatus;
  college?: string;
  currency: Currency;
  currencySymbol: string;
  budgetPeriod: BudgetPeriod;
  budgetAmount: number;
  isOnboarded: boolean;
}

export type WalletType = 'cash' | 'bank' | 'digital' | 'custom';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  openingBalance: number;
  currentBalance: number;
  isArchived: boolean;
  icon: string;
  color: string;
  accountNumber?: string;
}

export type TransactionType = 'expense' | 'income' | 'transfer';
export type TransactionSource = 'manual' | 'email_import';
export type TransactionStatus = 'confirmed' | 'pending';

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  walletId: string;
  toWalletId?: string; // Required for transfers
  categoryId?: string; // N/A for transfers
  date: string;
  tags: string[];
  source: TransactionSource;
  status: TransactionStatus;
}

export type CategoryType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isCustom: boolean;
  isArchived: boolean;
}

export type LoanType = 'OWED_BY_ME' | 'OWED_TO_ME';

export interface Repayment {
  id: string;
  amount: number;
  date: string;
  walletId?: string;
  note?: string;
}

export interface LoanDue {
  id: string;
  title: string;
  personName: string;
  type: LoanType;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'ACTIVE' | 'SETTLED';
  repayments: Repayment[];
}

export type AutopayFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Autopay {
  id: string;
  name: string;
  amount: number;
  frequency: AutopayFrequency;
  categoryId: string;
  walletId: string;
  nextDueDate: string;
  status: 'UPCOMING' | 'PAID' | 'PAST_DUE';
}
