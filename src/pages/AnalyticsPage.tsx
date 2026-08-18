import React from 'react';
import { useApp } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { transactions, wallets, categories, formatCurrency } = useApp();

  // Expenses & Incomes
  const expenseTx = transactions.filter(t => t.type === 'expense');
  const incomeTx = transactions.filter(t => t.type === 'income');

  const totalExpense = expenseTx.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = incomeTx.reduce((acc, t) => acc + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  // Average daily spending (assuming last 30 days)
  const avgDailySpending = Math.round(totalExpense / 30);

  // Category spending data for Pie Chart
  const categoryData = categories
    .filter(c => c.type === 'expense')
    .map(c => {
      const value = expenseTx.filter(t => t.categoryId === c.id).reduce((acc, t) => acc + t.amount, 0);
      return { name: c.name, value, color: c.color, icon: c.icon };
    })
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value);

  const topCategory = categoryData[0] || { name: 'None', value: 0 };

  // Income vs Expense comparison data
  const comparisonData = [
    { name: 'Income', amount: totalIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpense, fill: '#ef4444' },
  ];

  // Wallet distribution data
  const walletDistribution = wallets
    .filter(w => !w.isArchived)
    .map(w => ({ name: w.name, balance: w.currentBalance, fill: w.color }));

  // Transaction Volume by Type
  const transferTx = transactions.filter(t => t.type === 'transfer');
  const typeDistribution = [
    { type: 'Expense', count: expenseTx.length, total: totalExpense, color: '#ef4444' },
    { type: 'Income', count: incomeTx.length, total: totalIncome, color: '#10b981' },
    { type: 'Transfer', count: transferTx.length, total: transferTx.reduce((acc, t) => acc + t.amount, 0), color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm transition-colors">
        <h1 className="text-2xl font-bold text-primary dark:text-slate-100">Detailed Financial Analytics</h1>
        <p className="text-xs text-on-surface-variant dark:text-slate-400">Deep-dive insights into cash flow efficiency, category allocation, and wallet growth</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Savings Rate */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Savings Rate</span>
          <h2 className="text-2xl font-extrabold text-success tabular-nums mt-2">{savingsRate}%</h2>
          <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">Net saved / Income</span>
        </div>

        {/* Avg Daily Spending */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Avg Daily Spend</span>
          <h2 className="text-2xl font-extrabold text-expense tabular-nums mt-2">{formatCurrency(avgDailySpending)}</h2>
          <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">Estimated 30-day run rate</span>
        </div>

        {/* Top Category */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Top Expense Category</span>
          <h2 className="text-lg font-bold text-primary dark:text-slate-100 truncate mt-2">{topCategory.name}</h2>
          <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">{formatCurrency(topCategory.value)} spent</span>
        </div>

        {/* Total Inflow */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Total Inflow</span>
          <h2 className="text-2xl font-extrabold text-success tabular-nums mt-2">+{formatCurrency(totalIncome)}</h2>
          <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">{incomeTx.length} transactions</span>
        </div>

        {/* Total Outflow */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-5 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Total Outflow</span>
          <h2 className="text-2xl font-extrabold text-expense tabular-nums mt-2">-{formatCurrency(totalExpense)}</h2>
          <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-medium">{expenseTx.length} transactions</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending Breakdown (Pie Chart) */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-primary dark:text-slate-100">Category Spending Distribution</h3>

          <div className="h-64 w-full">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-on-surface-variant dark:text-slate-400">No expense data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']} 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Income vs Expenses Bar Chart */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-primary dark:text-slate-100">Income vs Expenses Comparison</h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" fontSize={12} tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']} 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wallet Distribution */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-primary dark:text-slate-100">Wallet Assets Allocation</h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={walletDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tick={{ fill: '#94a3b8' }} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={130} tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Balance']} 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="balance" radius={[0, 8, 8, 0]}>
                  {walletDistribution.map((entry, index) => (
                    <Cell key={`wcell-${index}`} fill={entry.fill || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume by Transaction Type */}
        <div className="bg-surface-container-lowest dark:bg-[#151c28] p-6 rounded-2xl border border-outline-variant dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-primary dark:text-slate-100">Transaction Volume Breakdown</h3>

          <div className="space-y-4 pt-2">
            {typeDistribution.map(t => (
              <div key={t.type} className="p-4 rounded-xl border border-outline-variant/60 dark:border-slate-700/50 bg-surface-container-low/40 dark:bg-slate-900/40 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <div>
                    <h4 className="text-sm font-bold text-on-surface dark:text-slate-200">{t.type}s</h4>
                    <span className="text-xs text-on-surface-variant dark:text-slate-400">{t.count} transaction(s)</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-on-surface dark:text-slate-100 tabular-nums">
                  {formatCurrency(t.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
