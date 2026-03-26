import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [owedList, setOwedList] = useState([]);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    transactionCount: 0,
  });
  const [monthlyBudget, setMonthlyBudget] = useState(20000);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        expensesRes,
        owedRes,
        summaryRes,
        budgetRes,
        budgetsRes,
        goalsRes,
      ] = await Promise.all([
        API.get("/expenses"),
        API.get("/owed"),
        API.get("/expenses/summary"),
        API.get("/budgets/limit"),
        API.get("/budgets"),
        API.get("/goals"),
      ]);

      setTransactions(expensesRes.data || []);
      setOwedList(owedRes.data || []);
      setSummary({
        totalSpent: summaryRes.data?.totalExpense || 0,
        transactionCount: summaryRes.data?.transactionCount || 0,
      });
      setMonthlyBudget(budgetRes.data?.limit || 20000);
      setBudgets(budgetsRes.data || []);
      setGoals(goalsRes.data || []);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !dataLoaded) {
      fetchAllData();
    }
  }, [dataLoaded]);

  const refreshData = () => {
    setDataLoaded(false);
    fetchAllData();
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        owedList,
        summary,
        monthlyBudget,
        loading,
        refreshData,
        setTransactions,
        setBudgets,
        setGoals,
        setOwedList,
        setMonthlyBudget,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
