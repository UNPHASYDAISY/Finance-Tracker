"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BarChart3, Calendar, Filter, Tag, RefreshCw, ExternalLink } from "lucide-react"
import { getExpenses } from "@/app/actions/expense-actions"
import { useToast } from "@/hooks/use-toast"

interface Expense {
  amount: number
  category: string
  description: string
  date: string
  timestamp: string
}

const categories = [
  "All Categories",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Rent",
  "Groceries & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Personal Care",
  "Ashu's Corner",
  "Gifts",
  "Other",
]

export function ExpenseView() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const loadExpenses = async () => {
    setIsLoading(true)
    try {
      const result = await getExpenses()

      if (result.success && result.data) {
        setExpenses(result.data)
        setFilteredExpenses(result.data)
      } else {
        toast({
          title: "Error Loading Expenses",
          description: result.error || "Failed to load expenses from Google Sheets",
          variant: "destructive",
        })
        // Fallback to localStorage for offline functionality
        const savedExpenses = JSON.parse(localStorage.getItem("expenses") || "[]")
        setExpenses(savedExpenses)
        setFilteredExpenses(savedExpenses)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load expenses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = expenses

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((expense) => expense.category === selectedCategory)
    }

    if (selectedMonth) {
      filtered = filtered.filter((expense) => {
        const expenseMonth = new Date(expense.date).getMonth() + 1
        return expenseMonth === Number.parseInt(selectedMonth)
      })
    }

    if (selectedYear) {
      filtered = filtered.filter((expense) => {
        const expenseYear = new Date(expense.date).getFullYear()
        return expenseYear === Number.parseInt(selectedYear)
      })
    }

    setFilteredExpenses(filtered)
  }, [expenses, selectedCategory, selectedMonth, selectedYear])

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const clearFilters = () => {
    setSelectedCategory("All Categories")
    setSelectedMonth("")
    setSelectedYear("")
  }

  // Generate year options
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Your Expenses</h3>
          <p className="text-sm text-muted-foreground">Data synced with Google Sheets</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadExpenses}
          disabled={isLoading}
          className="flex items-center gap-2 bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl text-primary">
            <Filter className="h-5 w-5" />
            Filter Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Month
              </Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Months</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Year
              </Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 text-lg font-bold text-primary">₹</span>
              <span className="text-lg font-medium">Total Expenses:</span>
            </div>
            <span className="text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="text-center py-12">
            <CardContent>
              <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <CardTitle className="text-xl mb-2">Loading Expenses...</CardTitle>
              <CardDescription>Fetching data from Google Sheets</CardDescription>
            </CardContent>
          </Card>
        ) : filteredExpenses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">No Expenses Found</CardTitle>
              <CardDescription>
                {expenses.length === 0
                  ? "Start by adding your first expense!"
                  : "Try adjusting your filters to see more expenses."}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          filteredExpenses.map((expense, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-primary">₹{expense.amount.toFixed(2)}</span>
                      <Badge variant="secondary" className="text-sm">
                        {expense.category}
                      </Badge>
                    </div>
                    <p className="text-foreground font-medium mb-1">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Google Sheets Link */}
      {process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL && (
        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary">View in Google Sheets</h4>
                <p className="text-sm text-muted-foreground">Open your expense data directly in Google Sheets</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
              >
                <a
                  href={process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Sheet
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
