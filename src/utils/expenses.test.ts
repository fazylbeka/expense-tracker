import { describe, it, expect } from 'vitest'
import {
  discountRate,
  applyDiscount,
  totalAfterDiscount,
  totalByCategory,
  validateExpense,
  type Expense,
} from './expenses'

const sample: Expense[] = [
  { id: '1', description: 'Lunch', amount: 100, category: 'Food', customerType: 'regular' },
  { id: '2', description: 'Bus pass', amount: 50, category: 'Transport', customerType: 'student' },
  { id: '3', description: 'Textbook', amount: 80, category: 'Study', customerType: 'premium' },
  { id: '4', description: 'Snack', amount: 20, category: 'Food', customerType: 'student' },
]

describe('discountRate', () => {
  it('returns 0% for regular', () => {
    expect(discountRate('regular')).toBe(0)
  })
  it('returns 10% for student', () => {
    expect(discountRate('student')).toBe(0.1)
  })
  it('returns 20% for premium', () => {
    expect(discountRate('premium')).toBe(0.2)
  })
})

describe('applyDiscount', () => {
  it('applies 0% for regular', () => {
    expect(applyDiscount(100, 'regular')).toBe(100)
  })
  it('applies 10% for student', () => {
    expect(applyDiscount(100, 'student')).toBe(90)
  })
  it('applies 20% for premium', () => {
    expect(applyDiscount(100, 'premium')).toBe(80)
  })
})

describe('totalAfterDiscount', () => {
  it('sums discounted amounts across all expenses', () => {
    // 100 + 45 + 64 + 18 = 227
    expect(totalAfterDiscount(sample)).toBe(227)
  })
  it('returns 0 for empty list', () => {
    expect(totalAfterDiscount([])).toBe(0)
  })
})

describe('totalByCategory', () => {
  it('groups raw amounts by category', () => {
    const totals = totalByCategory(sample)
    expect(totals.Food).toBe(120)
    expect(totals.Transport).toBe(50)
    expect(totals.Study).toBe(80)
    expect(totals.Other).toBe(0)
  })
})
describe('validateExpense', () => {
  it('accepts valid input', () => {
    expect(validateExpense('Lunch', 10)).toBeNull()
  })
  it('rejects empty or whitespace description', () => {
    expect(validateExpense('   ', 10)).not.toBeNull()
  })
  it('rejects NaN amount', () => {
    expect(validateExpense('Lunch', NaN)).not.toBeNull()
  })
  it('rejects zero and negative amounts', () => {
    expect(validateExpense('Lunch', 0)).not.toBeNull()
    expect(validateExpense('Lunch', -5)).not.toBeNull()
  })
})