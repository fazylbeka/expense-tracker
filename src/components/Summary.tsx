import type { Expense } from '../utils/expenses'
import { CATEGORIES, totalByCategory, totalByCategoryAfterDiscount, totalAfterDiscount, totalBeforeDiscount } from '../utils/expenses'

interface Props {
  expenses: Expense[]
}

export default function Summary({ expenses }: Props) {
  const byCategory = totalByCategory(expenses)
  const byCategoryAfter = totalByCategoryAfterDiscount(expenses)
  const grandAfter = totalAfterDiscount(expenses)
  const grandBefore = totalBeforeDiscount(expenses)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map((c) => (
          <div key={c} className="bg-white rounded-lg shadow p-4">
            <p className="text-sm font-medium text-slate-500">{c}</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">${byCategory[c].toFixed(2)}</p>
            <p className="mt-0.5 text-xs text-slate-400">${byCategoryAfter[c].toFixed(2)} after discount</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-800 rounded-lg shadow p-6 flex items-center justify-between">
        <span className="text-slate-300 font-medium">Overall Total</span>
        <div className="text-right">
          <span className="text-slate-400 text-sm line-through">${grandBefore.toFixed(2)}</span>
          <span className="ml-3 text-2xl font-bold text-white">${grandAfter.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
