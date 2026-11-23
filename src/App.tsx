import { useState } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseTable from './components/ExpenseTable'
import Summary from './components/Summary'
import type { Expense } from './utils/expenses'

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  function addExpense(e: Omit<Expense, 'id'>) {
    setExpenses((prev) => [...prev, { ...e, id: crypto.randomUUID() }])
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Expense Tracker</h1>
          <p className="mt-1 text-slate-500">Track expenses with customer-type discounts</p>
        </header>

        <div className="space-y-6">
          <ExpenseForm onAdd={addExpense} />
          <Summary expenses={expenses} />
          <ExpenseTable expenses={expenses} onDelete={deleteExpense} />
        </div>
      </div>
    </div>
  )
}

export default App
