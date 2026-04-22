import { UnifiedTransaction } from "@/types/unified-transaction"
import { Voucher } from "@/types/voucher"

export interface PLSection {
  title: string
  amount: number
  isNegative?: boolean
}

export interface SectionalPLStatement {
  month: string
  sections: PLSection[]
  totalIncome: number
  totalExpense: number
  netProfit: number
  partnerShare: number
  partnerAdvance: number
}

/**
 * Aggregates P&L data into granular sections based on Section 8 mandates.
 */
export function aggregateSectionalPL(
  transactions: UnifiedTransaction[],
  vouchers: Voucher[],
  projectId: string | "all",
  ledgers: any[],
  groups: any[],
  projectType: "Toll" | "Balu" | "Other" = "Toll"
): SectionalPLStatement[] {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
  
  const filteredTxs = projectId === "all" ? transactions : transactions.filter(t => t.project === projectId)
  const filteredVouchers = projectId === "all" ? vouchers : vouchers.filter(v => v.projectId === projectId)

  return months.map(month => {
    // Helper to sum by report category
    const sumByCat = (type: "RECEIPT" | "PAYMENT", cat: string) => {
      return filteredVouchers
        .filter(v => v.type === type && v.date.includes(month))
        .reduce((sum, v) => {
          const linesSum = v.lines.reduce((lSum, l) => {
            const led = ledgers.find(led => led.id === l.ledgerId)
            const group = groups.find(g => g.id === led?.groupId)
            return group?.reportCategory === cat ? lSum + (v.type === "RECEIPT" ? l.crAmount || 0 : l.drAmount || 0) : lSum
          }, 0)
          return sum + linesSum
        }, 0)
    }

    let sections: PLSection[] = []
    let totalIncome = 0
    let totalExpense = 0

    if (projectType === "Balu") {
      // 8.5 Balu Sections
      const billing = sumByCat("RECEIPT", "Billing Details") || filteredTxs.filter(t => t.type === "Collection" && t.date.includes(month)).reduce((a, c) => a + (c as any).amount, 0)
      const oldHisab = sumByCat("RECEIPT", "Old Hisab")
      const licenseFees = sumByCat("PAYMENT", "License Fees")
      const oneTime = sumByCat("PAYMENT", "One Time Expense")
      const salesExp = sumByCat("PAYMENT", "Sales Expense")
      const opExp = sumByCat("PAYMENT", "Operation Expense")
      const dumpExp = sumByCat("PAYMENT", "Dump Expense")

      sections = [
        { title: "Billing Details", amount: billing },
        { title: "Old Hisab Part-1", amount: oldHisab },
        { title: "License Fees Part-2", amount: licenseFees, isNegative: true },
        { title: "One Time Expenses", amount: oneTime, isNegative: true },
        { title: "Sales Expenses", amount: salesExp, isNegative: true },
        { title: "Operation Expenses", amount: opExp, isNegative: true },
        { title: "Dump Expenses", amount: dumpExp, isNegative: true },
      ]
      totalIncome = billing + oldHisab
      totalExpense = licenseFees + oneTime + salesExp + opExp + dumpExp
    } else {
      // 8.3 Toll Sections
      const collection = sumByCat("RECEIPT", "Collection Details") || filteredTxs.filter(t => t.type === "Collection" && t.date.includes(month)).reduce((a, c) => a + (c as any).amount, 0)
      const salary = sumByCat("PAYMENT", "Salary Expense")
      const tollExp = sumByCat("PAYMENT", "Toll Expense")
      const officeExp = sumByCat("PAYMENT", "Office Expense")

      sections = [
        { title: "Collection Details", amount: collection },
        { title: "Salary Expense", amount: salary, isNegative: true },
        { title: "Toll Expenses", amount: tollExp, isNegative: true },
        { title: "Office Expenses", amount: officeExp, isNegative: true },
      ]
      totalIncome = collection
      totalExpense = salary + tollExp + officeExp
    }

    const netProfit = totalIncome - totalExpense
    
    // Partner Share (from Ratio in Master or flat % for Demo)
    const partnerShare = netProfit > 0 ? netProfit * 0.15 : 0 
    const partnerAdvance = sumByCat("PAYMENT", "Partner Advance")

    return {
      month,
      sections,
      totalIncome,
      totalExpense,
      netProfit,
      partnerShare,
      partnerAdvance
    }
  })
}

/**
 * Formula (8.1): Final Closing = Previous Closing + Cash Collection - Expense - Advance - Banking
 */
export interface LiquidityDay {
  date: string
  prevClosing: number
  collection: number
  upi: number
  cash: number
  expense: number
  advance: number
  banking: number
  finalClosing: number
}

export function getLiquidityLedger(
  startDate: string,
  endDate: string,
  openingBalance: number,
  transactions: UnifiedTransaction[],
  vouchers: Voucher[],
  ledgers: any[],
  groups: any[]
): LiquidityDay[] {
  // Logic to iterate days and apply the formula
  // Note: Simplified for demonstration; in production, this iterates every date.
  const ledger: LiquidityDay[] = []
  let runningBalance = openingBalance

  // (Mocking a few days)
  const dates = ["2024-04-10", "2024-04-11", "2024-04-12"]

  dates.forEach(d => {
    const dayVouchers = vouchers.filter(v => v.date === d)
    const dayTxs = transactions.filter(t => t.date === d)

    const collection = dayTxs.filter(t => t.type === "Collection").reduce((a, c) => a + (c as any).amount, 0)
    const cash = dayTxs.filter(t => t.type === "Collection" && (t as any).paymentMode === "Cash").reduce((a, c) => a + (c as any).amount, 0)
    const upi = collection - cash
    
    const expense = dayTxs.filter(t => t.type === "Expense").reduce((a, c) => a + (c as any).amount, 0) + 
                  dayVouchers.filter(v => v.type === "PAYMENT").reduce((a, v) => a + v.totalAmount, 0)
    
    const advance = dayVouchers.filter(v => v.type === "PAYMENT" && v.lines.some(l => {
      const g = groups.find(g => g.id === ledgers.find(led => led.id === l.ledgerId)?.groupId)
      return g?.reportCategory === "Partner Advance"
    })).reduce((a, v) => a + v.totalAmount, 0)

    const banking = dayVouchers.filter(v => v.type === "CONTRA").reduce((a, v) => a + v.totalAmount, 0)

    const finalClosing = runningBalance + cash - expense - advance - banking
    
    ledger.push({
      date: d,
      prevClosing: runningBalance,
      collection,
      upi,
      cash,
      expense,
      advance,
      banking,
      finalClosing
    })

    runningBalance = finalClosing
  })

  return ledger
}
export const calculateDailyClosing = (
  prevClosing: number, 
  collection: number, 
  expenses: number, 
  advances: number, 
  banking: number
) => {
  return (prevClosing + collection) - (expenses + advances + banking)
}
