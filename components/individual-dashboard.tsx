"use client"

import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

// -------------------------------------------
// CapWise - Individual Dashboard
// Single-file React component (Next.js App Router - client component)
// - Replace getMockData() with real API calls later (fetch('/api/individual/dashboard'))
// - Uses Tailwind CSS for layout & styling
// - Uses recharts for charts
// -------------------------------------------

const COLORS = ["#4F46E5", "#06B6D4", "#F59E0B", "#10B981", "#EF4444"]

function currency(n) {
  if (n == null) return "-"
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
}

async function getMockData() {
  // Simulate fetching from backend. Replace this with a real fetch() call when API is ready.
  await new Promise((r) => setTimeout(r, 220))

  const data = {
    balance: 12450.23,
    income: 42000,
    expenses: 30550,
    savings: 5000,
    personalVsProfessional: [
      { name: "Personal", value: 18500 },
      { name: "Professional", value: 12050 },
    ],
    weeklyTrend: [
      { day: "Mon", income: 4200, expense: 1500 },
      { day: "Tue", income: 3800, expense: 1700 },
      { day: "Wed", income: 4500, expense: 1200 },
      { day: "Thu", income: 2000, expense: 900 },
      { day: "Fri", income: 6000, expense: 2400 },
      { day: "Sat", income: 0, expense: 800 },
      { day: "Sun", income: 0, expense: 450 },
    ],
    incomeCycle: {
      usualArrival: "1st week",
      onTimePercent: 82,
      suggestions: [
        "Maintain 2 weeks of buffer when income is irregular",
        "Move 20% of payday income to an emergency fund",
      ],
    },
    transactions: [
      { id: 1, date: "2025-09-28", desc: "Salary (Acme Corp)", amount: 35000, type: "income", category: "Salary" },
      { id: 2, date: "2025-09-27", desc: "Freelance - UI task", amount: 7000, type: "income", category: "Freelance" },
      { id: 3, date: "2025-09-26", desc: "Dinner - Zomato", amount: -450, type: "expense", category: "Food" },
      { id: 4, date: "2025-09-24", desc: "Uber - commute", amount: -320, type: "expense", category: "Transport" },
      { id: 5, date: "2025-09-23", desc: "Domain renewal", amount: -899, type: "expense", category: "Services" },
    ],
  }

  return data
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white/80 dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  )
}

export default function IndividualDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
  let mounted = true;

  (async function () {
    const res = await getMockData();
    if (!mounted) return;
    setData(res);
    setLoading(false);
  })();

  return () => {
    mounted = false; // cleanup, no return value
  };
}, []);


  if (loading || !data) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">CapWise — Individual Dashboard</h1>
          <p className="text-sm text-gray-500">Summary of personal & professional finances</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm">Individual</div>
          <button
            className="px-3 py-1 rounded-full bg-white border text-sm shadow-sm"
            onClick={() => alert("Switch to Startup view later — will be implemented next.")}
          >
            Startup
          </button>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Current Balance"
          value={currency(data.balance)}
          subtitle={`Income: ${currency(data.income)} • Expenses: ${currency(data.expenses)}`}
        />
        <StatCard
          title="Monthly Income"
          value={currency(data.income)}
          subtitle={`Savings: ${currency(data.savings)}`}
        />
        <StatCard
          title="Monthly Expenses"
          value={currency(data.expenses)}
          subtitle={`${((data.expenses / Math.max(data.income, 1)) * 100).toFixed(0)}% of income`}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 rounded-2xl p-4 border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Spending: Personal vs Professional</h3>
              <div className="text-xs text-gray-400">Last 30 days</div>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.personalVsProfessional}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.personalVsProfessional.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Weekly Income & Expenses</h3>
              <div className="text-xs text-gray-400">This week</div>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.weeklyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#06B6D4" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border shadow-sm">
            <h3 className="font-medium mb-3">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="py-2">{t.date}</td>
                      <td className="py-2">{t.desc}</td>
                      <td className="py-2">{t.category}</td>
                      <td className={`py-2 font-medium ${t.amount < 0 ? "text-red-500" : "text-green-600"}`}>
                        {currency(Math.abs(t.amount))}
                        {t.amount < 0 ? "" : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Income cycle, AI insights */}
        <div className="space-y-6">
          <div className="bg-white/80 rounded-2xl p-4 border shadow-sm">
            <h3 className="font-medium">Income Cycle Tracker</h3>
            <div className="mt-3 text-sm text-gray-600">
              <div className="mb-2">
                Typical arrival: <strong>{data.incomeCycle.usualArrival}</strong>
              </div>
              <div className="mb-2">
                On-time arrival rate: <strong>{data.incomeCycle.onTimePercent}%</strong>
              </div>
              <div className="text-xs text-gray-400">Suggestions:</div>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
                {data.incomeCycle.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border shadow-sm">
            <h3 className="font-medium">AI Insights (placeholders)</h3>
            <div className="mt-3 text-sm text-gray-600">
              <div className="mb-2">
                Runway estimate: <strong>~{Math.max(1, Math.round(data.savings / (data.expenses / 30)))} days</strong>
              </div>
              <div className="mb-2">Quick wins:</div>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
                <li>Reduce recurring subscriptions — potential savings ₹899 / mo</li>
                <li>Delay non-critical purchases until paycheck (1st week)</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border shadow-sm">
            <h3 className="font-medium">Actions</h3>
            <div className="mt-3 flex flex-col space-y-2">
              <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white">Create Budget</button>
              <button className="px-3 py-2 rounded-lg border">Export Transactions (CSV)</button>
              <button className="px-3 py-2 rounded-lg border">Connect Bank / Upload Statement</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
