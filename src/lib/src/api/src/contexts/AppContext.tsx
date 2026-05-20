import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Client, Transaction, Agent, MarketingEntry, Lead } from '../lib/types';
import { fetchCrmHubData, submitClientUpdate, submitTransaction } from '../api/crmApi';

interface AppContextType {
  isDark: boolean;
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isLoading: boolean;
  clients: Client[];
  transactions: Transaction[];
  agents: Agent[];
  marketing: MarketingEntry[];
  leads: Lead[];
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, rowId: number, data: Partial<Client>) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('crm-theme') !== 'light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [marketing, setMarketing] = useState<MarketingEntry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchCrmHubData();
      if (data.clients) setClients(data.clients);
      if (data.transactions) setTransactions(data.transactions);
      if (data.agents) setAgents(data.agents);
      if (data.marketing) setMarketing(data.marketing);
    } catch (err) {
      console.error("Failed syncing live sheet arrays");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const toggleTheme = () => {
    setIsDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('crm-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const toggleSidebar = () => setSidebarCollapsed(s => !s);

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    const trackingId = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullClient = { ...clientData, id: trackingId };
    await submitClientUpdate(fullClient);
    loadAllData();
  };

  const updateClient = async (id: string, rowId: number, data: Partial<Client>) => {
    const current = clients.find(c => c.id === id);
    if (!current) return;
    const updated = { ...current, ...data, rowId };
    await submitClientUpdate(updated);
    loadAllData();
  };

  const addTransaction = async (txData: Omit<Transaction, 'id'>) => {
    const txId = `TX-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullTx = { ...txData, id: txId };
    await submitTransaction(fullTx);
    loadAllData();
  };

  return (
    <AppContext.Provider value={{
      isDark, toggleTheme, sidebarCollapsed, toggleSidebar, isLoading,
      clients, transactions, agents, marketing, leads,
      addClient, updateClient, addTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside an AppProvider');
  return ctx;
}