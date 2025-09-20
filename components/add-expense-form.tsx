"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Tag, FileText, Upload } from "lucide-react"
import { addExpense } from "@/app/actions/expense-actions"

const categories = [
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
  "Princess' Corner",
  "Gifts",
  "Other",
]

export function AddExpenseForm() {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !category || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await addExpense({
        amount: Number.parseFloat(amount),
        category,
        description,
        date,
      })

      if (result.success) {
        toast({
          title: "Expense Added! 🎉",
          description: `Successfully added ₹${amount} for ${category} to Google Sheets`,
        })

        // Reset form
        setAmount("")
        setCategory("")
        setDescription("")
        setDate(new Date().toISOString().split("T")[0])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add expense. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-primary">
          <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
          Add New Expense
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Track your spending by adding expense details below. Data will be saved to Google Sheets.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2 text-sm sm:text-base font-medium">
                <span className="h-3 w-3 sm:h-4 sm:w-4 text-xs sm:text-sm font-bold">₹</span>
                Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-base sm:text-lg py-3 sm:py-3 h-12 sm:h-auto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2 text-sm sm:text-base font-medium">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-base sm:text-lg py-3 sm:py-3 h-12 sm:h-auto"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
              Category *
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="text-base sm:text-lg py-3 sm:py-3 h-12 sm:h-auto">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-sm sm:text-base py-3">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm sm:text-base min-h-[80px] sm:min-h-[100px] resize-none"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full text-base sm:text-lg py-4 sm:py-6 font-semibold h-12 sm:h-auto"
            disabled={isLoading}
          >
            {isLoading ? "Saving to Google Sheets..." : "Add Expense 💝"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
