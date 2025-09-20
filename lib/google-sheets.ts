import { google } from "googleapis"

// Google Sheets configuration
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

export interface Expense {
  amount: number
  category: string
  description: string
  date: string
  timestamp: string
}

// Initialize Google Sheets client
function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
    },
    scopes: SCOPES,
  })

  return google.sheets({ version: "v4", auth })
}

export async function addExpenseToSheet(expense: Expense) {
  try {
    const sheets = getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error("Google Sheets Spreadsheet ID not configured")
    }

    // Prepare the row data
    const values = [[expense.date, expense.amount, expense.category, expense.description, expense.timestamp]]

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:E", // Adjust range as needed
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error adding expense to Google Sheets:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getExpensesFromSheet(): Promise<{ success: boolean; data?: Expense[]; error?: string }> {
  try {
    const sheets = getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error("Google Sheets Spreadsheet ID not configured")
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:E", // Adjust range as needed
    })

    const rows = response.data.values || []

    // Skip header row if it exists
    const dataRows = rows.slice(1)

    const expenses: Expense[] = dataRows.map((row) => ({
      date: row[0] || "",
      amount: Number.parseFloat(row[1]) || 0,
      category: row[2] || "",
      description: row[3] || "",
      timestamp: row[4] || new Date().toISOString(),
    }))

    return { success: true, data: expenses }
  } catch (error) {
    console.error("Error fetching expenses from Google Sheets:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function initializeSheet() {
  try {
    const sheets = getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error("Google Sheets Spreadsheet ID not configured")
    }

    // Check if header row exists, if not, add it
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:E1",
    })

    if (!response.data.values || response.data.values.length === 0) {
      // Add header row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Sheet1!A1:E1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [["Date", "Amount", "Category", "Description", "Timestamp"]],
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error initializing Google Sheet:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
