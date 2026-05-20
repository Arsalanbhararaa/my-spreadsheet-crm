export type ClientStatus = 'Active' | 'Inactive' | 'VIP' | 'Prospect';
export type TransactionStatus = 'Pending' | 'Completed' | 'Cancelled' | 'Refunded';
export type Priority = 'High' | 'Medium' | 'Low';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Client {
  id: string;
  rowId?: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  brand: string;      
  orderId?: string;
  websiteUrl?: string;
  source?: string;
  notes?: string;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  rowId?: number;
  clientId: string;
  clientName: string;
  amount: number;
  type: string;
  status: TransactionStatus;
  date: string;
  agent: string;
  invoiceNo: string;
  brand: string;      
  notes?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  target?: string;
  achieved?: string;
  remaining?: string;
  dailyAverage?: string;
  ppcLeads?: string;
  smmLeads?: string;
  smmAccounts?: string;
  ppcAccounts?: string;
  ofAccounts?: string;
  overallRevenue?: string;
}

export interface MarketingEntry {
  date: string;
  ppcSpent: string;
  ppcLeads: number;
  ppcConversion: string;
  socialAdSpent: string;
  socialLeads: number;
  socialConversion: string;
  marketingSpend: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: LeadStatus;
  priority: Priority;
  agent: string;
  value: number;
  notes: string;
  createdAt: string;
  followUpDate: string;
}