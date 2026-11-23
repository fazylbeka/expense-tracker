import { useState } from 'react'
import type { Category, CustomerType, Expense } from '../utils/expenses'
import { CATEGORIES, CUSTOMER_TYPES, validateExpense } from '../utils/expenses'

interface Props {
  onAdd: (e: Omit<Expense, 'id'>) => void
}

const emptyForm = {
  description: '',
  amount: '',
  category: 'Food' as Category,
  customerType: 'regular' as CustomerType,
}

export default function ExpenseForm({ onAdd }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)

  
  function submit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    const validationError = validateExpense(form.description, amount)
    if (validationError !== null) {
      setError(validationError)
      return
    }
    setError(null)
    onAdd({ description: form.description.trim(), amount, category: form.category, customerType: form.customerType })
    setForm(emptyForm)
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Add Expense</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Description</span>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="e.g. Lunch"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="0.00"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Category</span>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Customer Type</span>
          <select
            value={form.customerType}
            onChange={(e) => setForm({ ...form, customerType: e.target.value as CustomerType })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {CUSTOMER_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
        </label>
      </div>
      {error && (
        <p role="alert" className="text-sm text-rose-600">{error}</p>
      )}
      <button
        type="submit"
        className="w-full rounded-md bg-slate-800 px-4 py-2 text-white font-medium transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        Add Expense
      </button>
    </form>
  )
}
