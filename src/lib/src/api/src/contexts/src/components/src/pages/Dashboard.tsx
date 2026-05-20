import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { DollarSign, Users, TrendingUp, BarChart3, Building2, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const { clients, transactions, marketing, isDark } = useApp();
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  // 1. Get the list of unique brands for your dropdown filter
  const brandsList = ['All', 'Hexa Flow Agency', 'HFA', 'AWT'];

  // 2. Filter data down accurately based on the chosen brand tag
  const filteredClients = useMemo(() => {
    if (selectedBrand === 'All') return clients;
    return clients.filter(c => c.brand === selectedBrand);
  }, [clients, selectedBrand]);

  const filteredTransactions = useMemo(() => {
    const txs = transactions.filter(t => t.status === 'Completed');
    if (selectedBrand === 'All') return txs;
    return txs.filter(t => t.brand === selectedBrand);
  }, [transactions, selectedBrand]);

  // 3. Compute metric scorecards balances
  const totalRevenue = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [filteredTransactions]);

  const activeClientsCount = useMemo(() => {
    return filteredClients.filter(c => c.status === 'Active' || c.status === 'VIP').length;
  }, [filteredClients]);

  const totalMarketingSpend = useMemo(() => {
    // If filtering specific internal brands, calculate distribution or show complete global log
    return marketing.reduce((sum, m) => sum + (parseFloat(m.marketingSpend) || 0), 0);
  }, [marketing]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper Panel Greeting and Brand Selector Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Business Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time stats synced directly from your Google Sheets master.</p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <Building2 size={18} className="text-indigo-500" />
          </div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={`text-sm font-medium rounded-xl px-3 py-2 outline-none border focus:ring-2 focus:ring-indigo-500/20 transition-all
              ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
          >
            {brandsList.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Matrix Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Revenue */}
        <div className={`p-6 rounded-2xl border transition-all duration-200 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1 font-medium">
              <ArrowUpRight size={14} /> Completed earnings
            </p>
          </div>
        </div>

        {/* Metric 2: Active Managed Accounts */}
        <div className={`p-6 rounded-2xl border transition-all duration-200 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Active Clients</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight">{activeClientsCount}</h3>
            <p className="text-xs text-slate-400 mt-1">Active/VIP contract status tags</p>
          </div>
        </div>

        {/* Metric 3: Total Transactions Volume */}
        <div className={`p-6 rounded-2xl border transition-all duration-200 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Total Deals Closed</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight">{filteredTransactions.length}</h3>
            <p className="text-xs text-slate-400 mt-1">Paid invoice count</p>
          </div>
        </div>

        {/* Metric 4: Global Marketing Expenditures */}
        <div className={`p-6 rounded-2xl border transition-all duration-200 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Marketing Spend</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight">
              ${selectedBrand === 'All' ? totalMarketingSpend.toLocaleString() : '---'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {selectedBrand === 'All' ? 'Consolidated sheet expenditures' : 'Global logging only'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Sales Activity Tracker Table */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="mb-4">
          <h3 className="text-base font-semibold">Recent Settlement Logs</h3>
          <p className="text-xs text-slate-400">Latest recorded incoming payments stream</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                <th className="pb-3 font-medium">Invoice No</th>
                <th className="pb-3 font-medium">Client Reference</th>
                <th className="pb-3 font-medium">Brand</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent">
              {filteredTransactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                  <td className="py-3 font-mono text-xs text-indigo-500">{tx.invoiceNo || tx.id}</td>
                  <td className="py-3 font-medium">{tx.clientName}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      tx.brand === 'AWT' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      {tx.brand}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-emerald-500">${Number(tx.amount || 0).toFixed(2)}</td>
                  <td className="py-3 text-slate-400 text-xs">{tx.date}</td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    No transactions matching filter constraints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}