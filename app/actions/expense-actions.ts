"use server"

import { addExpenseToSheet, getExpensesFromSheet, initializeSheet, type Expense } from "@/lib/google-sheets"
import { revalidatePath } from "next/cache"

export async function addExpense(expense: Omit<Expense, "timestamp">) {
  try {
    const expenseWithTimestamp: Expense = {
      ...expense,
      timestamp: new Date().toISOString(),
    }

    const result = await addExpenseToSheet(expenseWithTimestamp)

    if (result.success) {
      revalidatePath("/")
      return { success: true, message: "Expense added successfully!" }
    } else {
      return { success: false, error: result.error || "Failed to add expense" }
    }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Server error occurred" }
  }
}

export async function getExpenses() {
  try {
    const result = await getExpensesFromSheet()

    if (result.success && result.data) {
      return { success: true, data: result.data }
    } else {
      return { success: false, error: result.error || "Failed to fetch expenses" }
    }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Server error occurred" }
  }
}

export async function setupGoogleSheet() {
  try {
    const result = await initializeSheet()

    if (result.success) {
      return { success: true, message: "Google Sheet initialized successfully!" }
    } else {
      return { success: false, error: result.error || "Failed to initialize sheet" }
    }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Server error occurred" }
  }
}
