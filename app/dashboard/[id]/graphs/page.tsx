"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Define types for our data
type Expense = {
  id: number
  amount: number
  category: number // Foreign key to Category
}

type Category = {
  id: number
  name: string
  color: string
}

// Sample data
const expenses: Expense[] = [
  { id: 1, amount: 300, category: 1 },
  { id: 2, amount: 150, category: 2 },
  { id: 3, amount: 200, category: 3 },
  { id: 4, amount: 100, category: 1 },
  { id: 5, amount: 250, category: 2 },
  { id: 6, amount: 180, category: 3 },
]

const categories: Category[] = [
  { id: 1, name: "Food", color: "hsl(var(--chart-1))" },
  { id: 2, name: "Transportation", color: "hsl(var(--chart-2))" },
  { id: 3, name: "Entertainment", color: "hsl(var(--chart-3))" },
]

// Process data for the chart
const chartData = categories.map(category => {
  const totalAmount = expenses
    .filter(expense => expense.category === category.id)
    .reduce((sum, expense) => sum + expense.amount, 0)
  
  return {
    name: category.name,
    amount: totalAmount,
    color: category.color,
  }
})

export default function ExpenseChart() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Total expenses by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))' }}
              label={{ 
                value: 'Amount ($)', 
                angle: -90, 
                position: 'insideLeft',
                fill: 'hsl(var(--foreground))'
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="amount" 
              fill="currentColor"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

import { Cell } from "recharts"
