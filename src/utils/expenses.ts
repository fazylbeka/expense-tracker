export type Category = 'Food' | 'Transport' | 'Study' | 'Other'
export type CustomerType = 'regular' | 'student' | 'premium'

export interface Expense {
  id: string
  description: string
  amount: number
  category: Category
  customerType: CustomerType
}

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Study', 'Other']
export const CUSTOMER_TYPES: CustomerType[] = ['regular', 'student', 'premium']

export function discountRate(customerType: CustomerType): number {
  if (customerType === 'student') {
    return 0.1
  } else if (customerType === 'premium') {
    return 0.2
  } else {
    return 0
  }
}

export function applyDiscount(amount: number, customerType: CustomerType): number {
  const rate = discountRate(customerType)
  return Math.round(amount * (1 - rate) * 100) / 100
}

export function totalAfterDiscount(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + applyDiscount(e.amount, e.customerType), 0)
}

export function totalBeforeDiscount(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}

export function totalByCategory(expenses: Expense[]): Record<Category, number> {
  const result = { Food: 0, Transport: 0, Study: 0, Other: 0 } as Record<Category, number>
  for (const e of expenses) {
    result[e.category] += e.amount
  }
  return result
}

export function totalByCategoryAfterDiscount(expenses: Expense[]): Record<Category, number> {
  const result = { Food: 0, Transport: 0, Study: 0, Other: 0 } as Record<Category, number>
  for (const e of expenses) {
    result[e.category] += applyDiscount(e.amount, e.customerType)
  }
  return result
}

export function validateExpense(description: string, amount: number): string | null {
  if (!description.trim()) return 'Description is required'
  if (Number.isNaN(amount)) return 'Amount must be a number'
  if (amount <= 0) return 'Amount must be greater than 0'
  return null
}