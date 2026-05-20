import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Search, UserPlus, Filter, Mail, Phone, Globe, Edit3 } from 'lucide-react';
import { Client } from '../lib/types';

export default function Clients() {
  const { clients, updateClient, isDark } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Filters local client arrays based on Search Bar + Brand Dropdown
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.id?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBrand = selectedBrand === 'All' || client.brand === selectedBrand;
      
      return matchesSearch && matchesBrand;
    });
  }, [clients, searchQuery, selectedBrand]);

  // Handle saving modifications back to the spreadsheet
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editingClient.rowId) return;
    
    try {
      await updateClient(editingClient.id, editingClient.rowId, {
        name: editingClient.name,
        email: editingClient.email,
        phone: editingClient.phone,
        status: editingClient.status,
        notes: editingClient.notes,
      });
      setEditingClient(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Client Profiles</h1>
        <p className="text-sm text-slate-400 mt-1">Manage corporate contracts, brand tags, and contact lines sync-linked with Sheets.</p>
      </div>

      {/* Control Utility Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all
              ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800'}`}
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

      {/* Roster Data Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => (
          <div 
            key={client.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 group relative
              ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}
          >
            <div>
              {/* Profile Header Block */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                    {client.id}
                  </span>
                  <h3 className="text-base font-bold mt-1.5 line-clamp-1">{client.name || 'Unnamed Account'}</h3>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  client.status === 'Active' || client.status === 'VIP'
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-slate-500/10 text-slate-400'
                }`}>
                  {client.status || 'Prospect'}
                </span>
              </div>

              {/* Company Assigned Core Brand Tag */}
              <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {client.brand}
              </p>

              {/* Info Anchors Grid */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-400">
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-slate-500" />
                  <span className="truncate text-slate-300">{client.email || 'No email saved'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-slate-500" />
                  <span>{client.phone || 'No direct phone line'}</span>
                </div>
                {client.websiteUrl && (
                  <div className="flex items-center gap-2.5">
                    <Globe size={14} className="text-slate-500" />
                    <a href={client.websiteUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline truncate">
                      {client.websiteUrl}
                    </a>
                  </div>
                )}
              </div>

              {client.notes && (
                <div className={`mt-4 p-3 rounded-xl text-xs line-clamp-2 ${isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                  {client.notes}
                </div>
              )}
            </div>

            {/* Quick Actions Panel Footer */}
            <div className="mt-6 pt-3 border-t border-inherit flex justify-end">
              <button
                onClick={() => setEditingClient(client)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-indigo-500/5 transition-all"
              >
                <Edit3 size={13} /> Edit Account
              </button>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-slate-500">
            No dynamic client row entries match your filter constraints.
          </div>
        )}
      </div>

      {/* Interactive Profile Editor Flyout Popup */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl animate-scale-in
              ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}
          >
            <div className="mb-5">
              <h3 className="text-lg font-bold">Edit Client Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">Modifications sync back to Google row index: {editingClient.rowId}</p>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">Full Corporate Name</label>
                <input
                  type="text"
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Email Connection</label>
                  <input
                    type="email"
                    value={editingClient.email || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Direct Phone Line</label>
                  <input
                    type="text"
                    value={editingClient.phone || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">Account Relationship Status</label>
                <select
                  value={editingClient.status || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Prospect">Prospect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">Internal Log Notes</label>
                <textarea
                  rows={3}
                  value={editingClient.notes || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none resize-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50'}`}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button