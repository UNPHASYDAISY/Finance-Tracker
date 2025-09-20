"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddExpenseForm } from "@/components/add-expense-form"
import { ExpenseView } from "@/components/expense-view"
import { Heart, Plus, BarChart3 } from "lucide-react"

export default function FinanceTracker() {
  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary fill-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-balance">
              Our Finance Tracker
            </h1>
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary fill-primary" />
          </div>
          <p className="text-muted-foreground text-base sm:text-lg text-pretty">
            Keep track of your expenses 💕
          </p>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-2">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl text-primary">Expense Manager</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Add new expenses or view your spending history
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <Tabs defaultValue="add" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-12 sm:h-auto">
                <TabsTrigger
                  value="add"
                  className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base py-2 sm:py-3 px-2 sm:px-4"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Add Expense</span>
                  <span className="xs:hidden">Add</span>
                </TabsTrigger>
                <TabsTrigger
                  value="view"
                  className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base py-2 sm:py-3 px-2 sm:px-4"
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">View Expenses</span>
                  <span className="xs:hidden">View</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="add" className="mt-4 sm:mt-6">
                <AddExpenseForm />
              </TabsContent>

              <TabsContent value="view" className="mt-4 sm:mt-6">
                <ExpenseView />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
