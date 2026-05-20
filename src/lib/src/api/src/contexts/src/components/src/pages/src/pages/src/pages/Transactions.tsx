import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Search, DollarSign, Calendar, Landmark, ArrowDownLeft, PlusCircle, Filter } from 'lucide-react';

export default function Transactions() {
  const { transactions, addTransaction, isDark } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form State Variable blocks
  const [newTx, setNewTx] = useState({
    clientId: '',
    clientName: '',
    amount: '',
    type: 'Website Design',
    status: 'Completed' as 'Completed' | 'Pending',
    agent: '',
    invoiceNo: '',
    brand: 'Hexa Flow Agency',
    notes: ''
  });

  // Dynamic filter for transactions ledger based on Search & Brand selection
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = 
        tx.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.clientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.clientName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBrand = selectedBrand === 'All' || tx.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [transactions, searchQuery, selectedBrand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction({
        clientId: newTx.clientId, // Transactions map back via Client ID lookup
        clientName: newTx.clientName,
        amount: Number(newTx.amount) || 0,
        type: newTx.type,
        status: newTx.status,
        date: new Date().toLocaleDateString('en-US'),
        agent: newTx.agent,
        invoiceNo: newTx.invoiceNo || `INV-${Math.floor(100000 + Math.random() * 900000)}`,
        brand: newTx.brand,
        notes: newTx.notes
      });
      setShowAddModal(false);
      setNewTx({
        clientId: '', clientName: '', amount: '', type: 'Website Design',
        status: 'Completed', agent: '', invoiceNo: '', brand: 'Hexa Flow Agency', notes: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Transactions Ledger</h1>
          <p className="text-sm text-slate-400 mt-1">Audit invoice logs, deal valuations, and stream metrics across operations.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 self-start sm:self-auto transition-all"
        >
          <PlusCircle size={16} /> Log Transaction
        </button>
      </div>

      {/* Control Utility Filter Strip */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search Client ID, Name, or Invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all
              ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3 justify-end">
          <Filter size={16} className="text-slate-400 hidden sm:block" />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={`text-sm font-medium rounded-xl px-3 py-2.5 outline-none border transition-all
              ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
          >
            <option value="All">All Brands</option>
            <option value="Hexa Flow Agency">Hexa Flow Agency</option>
            <option value="HFA">HFA</option>
            <option value="AWT">AWT</option>
          </select>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-100 bg-slate-50/50 text-slate-500'}`}>
                <th className="px-6 py-4 font-medium">Invoice No</th>
                <th className="px-6 py-4 font-medium">Client Reference (ID)</th>
                <th className="px-6 py-4 font-medium">Brand Portfolio</th>
                <th className="px-6 py-4 font-medium">Service Domain</th>
                <th className="px-6 py-4 font-medium">Settlement</th>
                <th className="px-6 py-4 font-medium">Billing Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/40'} transition-colors`}>
                  <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-semibold">{tx.invoiceNo || tx.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{tx.clientName}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {tx.clientId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      tx.brand === 'AWT' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      {tx.brand}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-medium">{tx.type}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-emerald-400">${Number(tx.amount || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{tx.date}</td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-500">
                    No transactional records meet your selected filter filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup: Log New Transaction */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl animate-scale-in ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="mb-5">
              <h3 className="text-lg font-bold">Log New Settlement</h3>
              <p className="text-xs text-slate-400 mt-0.5">Appends a fresh transaction line onto the Sheets master ledger.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Client ID *</label>
                  <input
                    type="text"
                    placeholder="e.g. C-4891"
                    value={newTx.clientId}
                    onChange={(e) => setNewTx({ ...newTx, clientId: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Client Display Name</label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={newTx.clientName}
                    onChange={(e) => setNewTx({ ...newTx, clientName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Invoice Number</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={newTx.invoiceNo}
                    onChange={(e) => setNewTx({ ...newTx, invoiceNo: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Amount Valuation ($) *</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Brand Portfolio Selection</label>
                  <select
                    value={newTx.brand}
                    onChange={(e) => setNewTx({ ...newTx, brand: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                  >
                    <option value="Hexa Flow Agency">Hexa Flow Agency</option>
                    <option value="HFA">HFA</option>
                    <option value="AWT">AWT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Service Domain Category</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                  >
                    <option value="Website Design">Website Design</option>
                    <option value="SEO Optimization">SEO Optimization</option>
                    <option value="Marketing Campaign">Marketing Campaign</option>
                    <option value="Consultancy Retainer">Consultancy Retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">Closing Account Agent / Manager</label>
                <input
                  type="text"
                  placeholder="e.g. Asjad, Moiz, Mahad"
                  value={newTx.agent}
                  onChange={(e) => setNewTx({ ...newTx, agent: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate