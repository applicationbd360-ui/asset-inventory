import api from './client';

export interface Budget {
  id: number;
  fiscalYear: number;
  budgetType: 'CAPEX' | 'OPEX';
  costCenterId: number;
  costCenter?: { code: string; name: string };
  budgetedAmount: number;
  utilizedAmount: number;
  committedAmount: number;
  availableAmount: number;
}

export const budgetApi = {
  getBudgets: async (year?: number): Promise<Budget[]> => {
    const res = await api.get('/finance/budgets', { params: year ? { year } : {} });
    return res.data.data;
  },

  allocateBudget: async (data: {
    fiscalYear: number;
    budgetType: string;
    costCenterId: number;
    budgetedAmount: number;
  }): Promise<Budget> => {
    const res = await api.post('/finance/budgets', data);
    return res.data.data;
  },

  checkBudgetAvailability: async (data: {
    costCenterId: number;
    budgetType: string;
    requiredAmount: number;
  }): Promise<{ isAvailable: boolean; availableAmount: number; message?: string }> => {
    const res = await api.post('/finance/budgets/check', data);
    return res.data;
  },
};
