import { UserProfile, Wallet, Category, Transaction, LoanDue, Autopay } from '../types';

export const initialUser: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  professionalStatus: 'student',
  college: '',
  currency: 'INR',
  currencySymbol: '₹',
  budgetPeriod: 'monthly',
  budgetAmount: 0,
  isOnboarded: false,
};

export const defaultCategories: Category[] = [
  // Expense Categories
  { id: 'cat_exp_food', name: 'Food', type: 'expense', icon: 'restaurant', color: '#f59e0b', isCustom: false, isArchived: false },
  { id: 'cat_exp_transport', name: 'Transport', type: 'expense', icon: 'directions_bus', color: '#3b82f6', isCustom: false, isArchived: false },
  { id: 'cat_exp_shopping', name: 'Shopping', type: 'expense', icon: 'shopping_bag', color: '#ec4899', isCustom: false, isArchived: false },
  { id: 'cat_exp_entertainment', name: 'Entertainment', type: 'expense', icon: 'movie', color: '#8b5cf6', isCustom: false, isArchived: false },
  { id: 'cat_exp_education', name: 'Education', type: 'expense', icon: 'school', color: '#06b6d4', isCustom: false, isArchived: false },
  { id: 'cat_exp_bills', name: 'Bills & Utilities', type: 'expense', icon: 'receipt_long', color: '#ef4444', isCustom: false, isArchived: false },
  { id: 'cat_exp_health', name: 'Health', type: 'expense', icon: 'medical_services', color: '#10b981', isCustom: false, isArchived: false },
  { id: 'cat_exp_housing', name: 'Housing', type: 'expense', icon: 'home', color: '#6366f1', isCustom: false, isArchived: false },
  { id: 'cat_exp_travel', name: 'Travel', type: 'expense', icon: 'flight', color: '#14b8a6', isCustom: false, isArchived: false },
  { id: 'cat_exp_subscriptions', name: 'Subscriptions', type: 'expense', icon: 'subscriptions', color: '#f97316', isCustom: false, isArchived: false },
  { id: 'cat_exp_other', name: 'Miscellaneous', type: 'expense', icon: 'more_horiz', color: '#64748b', isCustom: false, isArchived: false },

  // Income Categories
  { id: 'cat_inc_salary', name: 'Salary', type: 'income', icon: 'work', color: '#10b981', isCustom: false, isArchived: false },
  { id: 'cat_inc_allowance', name: 'Allowance', type: 'income', icon: 'payments', color: '#3b82f6', isCustom: false, isArchived: false },
  { id: 'cat_inc_freelance', name: 'Freelance', type: 'income', icon: 'laptop_mac', color: '#8b5cf6', isCustom: false, isArchived: false },
  { id: 'cat_inc_refund', name: 'Refund', type: 'income', icon: 'replay', color: '#06b6d4', isCustom: false, isArchived: false },
  { id: 'cat_inc_gift', name: 'Gift', type: 'income', icon: 'card_giftcard', color: '#ec4899', isCustom: false, isArchived: false },
  { id: 'cat_inc_investment', name: 'Investment Income', type: 'income', icon: 'trending_up', color: '#10b981', isCustom: false, isArchived: false },
  { id: 'cat_inc_other', name: 'Miscellaneous', type: 'income', icon: 'more_horiz', color: '#64748b', isCustom: false, isArchived: false },
];

export const initialWallets: Wallet[] = [];
export const initialTransactions: Transaction[] = [];
export const initialLoansDues: LoanDue[] = [];
export const initialAutopays: Autopay[] = [];

