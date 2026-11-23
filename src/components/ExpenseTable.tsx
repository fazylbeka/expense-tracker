import type { Expense } from '../utils/expenses'
import { applyDiscount } from '../utils/expenses'

interface Props {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export default function ExpenseTable({ expenses, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-slate-500">
        No expenses yet. Add one above to get started.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Description</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold text-right">Amount</th>
            <th className="px-4 py-3 font-semibold text-right">After Discount</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((e) => (
            <tr key={e.id} className="text-slate-700 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">{e.description}</td>
              <td className="px-4 py-3">{e.category}</td>
              <td className="px-4 py-3 capitalize">{e.customerType}</td>
              <td className="px-4 py-3 text-right">${e.amount.toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-medium text-slate-800">
                ${applyDiscount(e.amount, e.customerType).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(e.id)}
                  className="rounded-md px-2 py-1 text-rose-600 transition-colors hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  aria-label={`Delete ${e.description}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
