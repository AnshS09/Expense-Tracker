import React from 'react';
import { useApp } from '../context/AppContext';
import { BudgetPeriod } from '../types';

export const BudgetsPage: React.FC = () => {
  const { user, updateUser, transactions, categories, formatCurrency } = useApp();

  const handlePeriodChange = (period: BudgetPeriod) => {
    updateUser({ budgetPeriod: period });
  };

  const handleCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    updateUser({ budgetAmount: val });
  };

  // Compute expenses grouped by category
  const expenseTx = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenseTx.reduce((acc, t) => acc + t.amount, 0);

  const categorySpending = categories
    .filter(c => c.type === 'expense')
    .map(c => {
      const spent = expenseTx.filter(t => t.categoryId === c.id).reduce((acc, t) => acc + t.amount, 0);
      return { ...c, spent };
    })
    .filter(c => c.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  const limit = user.budgetAmount || 25000;
  const percent = Math.min(100, Math.round((totalExpense / limit) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#151c28] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Budget & Spending Limits</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Set financial spending ceilings and monitor category utilization</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => handlePeriodChange('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              user.budgetPeriod === 'weekly' ? 'bg-primary dark:bg-slate-100 text-on-primary dark:text-slate-900 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => handlePeriodChange('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              user.budgetPeriod === 'monthly' ? 'bg-primary dark:bg-slate-100 text-on-primary dark:text-slate-900 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Main Budget Card */}
      <div className="bg-white dark:bg-[#151c28] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overall {user.budgetPeriod} Limit</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">{formatCurrency(totalExpense)}</span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/ {formatCurrency(limit)}</span>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Adjust {user.budgetPeriod} Cap</label>
            <input
              type="number"
              step="500"
              value={user.budgetAmount}
              onChange={handleCapChange}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2 px-3 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none tabular-nums"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-900 dark:text-slate-100">{percent}% Used</span>
            <span className="text-slate-500 dark:text-slate-400">{formatCurrency(Math.max(0, limit - totalExpense))} Remaining</span>
          </div>
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percent >= 100 ? 'bg-expense' : percent >= 80 ? 'bg-warning' : 'bg-primary dark:bg-slate-100'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Spending Breakdown */}
      <div className="bg-white dark:bg-[#151c28] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Category Spending Breakdown</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Architecture ready for per-category budget ceilings</p>

        <div className="space-y-4 pt-2">
          {categorySpending.map(cat => {
            const catPercent = Math.round((cat.spent / totalExpense) * 100) || 0;
            return (
              <div key={cat.id} className="space-y-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs" style={{ backgroundColor: cat.color }}>
                      <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-200">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{formatCurrency(cat.spent)}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] ml-2">({catPercent}% of total)</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${catPercent}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
