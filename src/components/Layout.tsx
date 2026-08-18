import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AddTransactionModal } from './Modals';

interface SidebarProps {
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAddModal }) => {
  const { user } = useApp();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: 'dashboard' },
    { label: 'Transactions', path: '/transactions', icon: 'receipt_long' },
    { label: 'Wallets', path: '/wallets', icon: 'account_balance_wallet' },
    { label: 'Loans & Dues', path: '/loans', icon: 'payments' },
    { label: 'Autopays', path: '/autopays', icon: 'event_repeat' },
    { label: 'Budgets', path: '/budgets', icon: 'monitoring' },
    { label: 'Analytics', path: '/analytics', icon: 'query_stats' },
  ];

  return (
    <nav className="bg-surface-container-lowest dark:bg-[#0b0f17] h-screen w-64 hidden md:flex flex-col fixed left-0 top-0 border-r border-outline-variant dark:border-slate-800 z-40 transition-colors">
      <div className="flex flex-col h-full p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-primary dark:bg-slate-100 text-on-primary dark:text-slate-900 flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined fill-1">account_balance</span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-primary dark:text-slate-100 tracking-tight">FinanceFlow</h1>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">Zenith Personal SaaS</p>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onOpenAddModal}
          className="w-full bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined fill-1">add</span>
          <span>Add Transaction</span>
        </button>

        {/* Navigation Items */}
        <ul className="flex flex-col gap-1.5 flex-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all active:scale-95 duration-200 ${
                    isActive
                      ? 'text-primary dark:text-slate-100 font-bold bg-surface-container-low dark:bg-[#151c28] border-l-4 border-primary dark:border-slate-100 shadow-sm'
                      : 'text-on-secondary-container dark:text-slate-400 hover:bg-surface-container-low dark:hover:bg-[#151c28]/60 hover:text-on-surface dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant dark:border-slate-800 pt-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive ? 'text-primary dark:text-slate-100 font-bold bg-surface-container-low dark:bg-[#151c28]' : 'text-on-secondary-container dark:text-slate-400 hover:bg-surface-container-low dark:hover:bg-[#151c28]/60'
              }`
            }
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </NavLink>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-3 px-3 py-2 mt-2 rounded-xl bg-surface-container-low dark:bg-[#151c28] border border-outline-variant/50 dark:border-slate-700/50">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-outline-variant dark:border-slate-700"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-on-surface dark:text-slate-200 truncate">{user.name}</span>
              <span className="text-[11px] text-on-surface-variant dark:text-slate-400 truncate">{user.email || 'user@example.com'}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface HeaderProps {
  onOpenAddModal: () => void;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal, onSearch }) => {
  const { user, isDarkMode, toggleDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="bg-white/90 dark:bg-[#0b0f17]/90 border-b border-outline-variant dark:border-slate-800 z-30 sticky top-0 flex justify-between items-center h-16 px-4 md:px-8 w-full backdrop-blur-md transition-colors">
      {/* Mobile Brand Title */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary dark:bg-slate-800 text-on-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">account_balance</span>
        </div>
        <h1 className="text-lg font-bold text-primary dark:text-slate-100">FinanceFlow</h1>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search transactions, wallets, tags..."
            className="w-full bg-surface-container-lowest dark:bg-[#151c28] border border-outline-variant dark:border-slate-700/60 rounded-full py-2 pl-10 pr-4 text-sm text-on-surface dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-primary dark:focus:border-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2.5 rounded-full text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-xl">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="hidden sm:inline text-xs font-semibold">
            {isDarkMode ? 'Light' : 'Dark'}
          </span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="md:hidden bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary p-2 rounded-full hover:opacity-90 transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-xl">add</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low dark:bg-[#151c28] border border-outline-variant dark:border-slate-700/60 text-xs font-semibold text-on-surface dark:text-slate-200">
          <span className="material-symbols-outlined text-sm">payments</span>
          <span>{user.currency} ({user.currencySymbol})</span>
        </div>
      </div>
    </header>
  );
};

interface MobileNavProps {
  onOpenAddModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenAddModal }) => {
  const navItems = [
    { label: 'Home', path: '/', icon: 'dashboard' },
    { label: 'Transactions', path: '/transactions', icon: 'receipt_long' },
    { label: 'Wallets', path: '/wallets', icon: 'account_balance_wallet' },
    { label: 'Loans', path: '/loans', icon: 'payments' },
    { label: 'More', path: '/settings', icon: 'menu' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest dark:bg-[#0b0f17] border-t border-outline-variant dark:border-slate-800 z-40 px-4 py-2 flex justify-between items-center shadow-lg transition-colors">
      {navItems.slice(0, 2).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? 'text-primary dark:text-slate-100 font-bold' : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}

      <button
        onClick={onOpenAddModal}
        className="-mt-6 bg-primary dark:bg-slate-100 dark:text-slate-900 text-on-primary p-3.5 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center border-4 border-surface dark:border-[#0b0f17]"
      >
        <span className="material-symbols-outlined text-2xl fill-1">add</span>
      </button>

      {navItems.slice(2).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? 'text-primary dark:text-slate-100 font-bold' : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const location = useLocation();

  const isAuthOrOnboarding = location.pathname === '/onboarding';

  if (isAuthOrOnboarding) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      <Sidebar onOpenAddModal={() => setIsAddModalOpen(true)} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f17]">
        <Header onOpenAddModal={() => setIsAddModalOpen(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>
        <MobileNav onOpenAddModal={() => setIsAddModalOpen(true)} />
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
