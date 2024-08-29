'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ListFilterIcon, FileIcon } from "./ui/icons"
import { Category, Expense, Profile, Project } from "@/prisma/prisma-client"
import TableComponent from "./TableComponent"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useOptimistic, useState } from "react"
import getExpenses from "@/app/actions/getExpenses"
import AddExpense from "./AddExpense"
import { User } from "@supabase/supabase-js"

export type UpdateExpenses = (action: {
    action: 'create' | 'delete' | 'update';
    expense?: Expense | undefined;
    id?: string | undefined;
}) => void

type Props = {
 expenses: Expense[]	| null | undefined
 user: User | null
 collaborators: Profile[] | undefined
 project: Project | undefined
 categories: Category[] | undefined
}
export default function Dashboard({ expenses, user, collaborators, project, categories}: Props)  {
	const supabase = createClient()
	const [ filteredExpenses, setFilteredExpenses ] = useState<Expense[] | null | undefined>(expenses)
	const [ activeTab, setActiveTab ] = useState("all")
	const [ optimisticExpenses, updateExpenses ] = useOptimistic(filteredExpenses, 
		(state, {action, expense, id} : 
		{action: 'create' | 'delete' | 'update', expense?: Expense, id?: string }) => {
			switch (action) {
				case "create":
					const result = expense && state ? [...state, expense] : state || [] 
					return result 
				case "delete":
					return id && state ? state.filter(e => e.id.toString() != id) : state || []
				case "update":
					const newArr: Expense[] = state?.filter(e => e.id != expense?.id) || []
					return expense ? [...newArr, expense] : state 
		}
	})

	useEffect(()=>{	
		const channel = supabase.channel('expenses')
			.on(
				'postgres_changes', 
				{event: '*', schema: 'public', table: 'Expense'}, 
				()=>getExpenses()
			).subscribe()
		return () => {
      channel.unsubscribe();
    };
	},[supabase])

	useEffect(() => {
    if (activeTab === "all") {
      setFilteredExpenses(expenses || [])
    } 
		if (activeTab === "thisMonth") {
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      const thisMonthExpenses = filteredExpenses?.filter(expense => {
        const expenseDate = new Date(expense.expense_date)
        return expenseDate >= firstDayOfMonth && expenseDate <= lastDayOfMonth
      })
      setFilteredExpenses(thisMonthExpenses || [])
    }
		if (categories) {
			for (let category of categories) {
				if (activeTab === category.name) {
					const categoryExpenses = filteredExpenses?.filter(expense => expense.category === category.id)
					setFilteredExpenses(categoryExpenses || [])
				}
			}
		}
  }, [activeTab, expenses])
	
	const handleTabChange = (value: string) => {
    setActiveTab(value)
  }
	

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 overflow-y-hidden">
      <div className="flex flex-col sm:gap-4 sm:py-4 ">
        <main className="grid flex-1 items-start p-4 sm:px-6 sm:py-0 gap-4">
					{
						project && 
						<h1 className="font-semibold text-2xl hidden lg:block">
							{project.name}
						</h1> 
					}
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <div className="flex items-center gap-x-10">
							<div className="flex flex-col gap-2 items-start h-full">
								<TabsList>
									<TabsTrigger value="all">
										All
									</TabsTrigger>
									<TabsTrigger value="thisMonth">
										This month
									</TabsTrigger>
								</TabsList>
								<TabsList>
									{
										categories?.map(category => (
											<TabsTrigger value={category.name}>
												{category.name}
											</TabsTrigger>	
										))
									}
								</TabsList>
							</div>
              <div className="ml-auto flex items-end h-full gap-2">
								<AddExpense 
									categories={categories}
									collaborators={collaborators}
									updateExpenses={updateExpenses}
									project={project}
									user={user}
								/>	
              </div>
            </div>
            <TabsContent value={activeTab}>
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle className="font-normal text-lg">Expenses</CardTitle>
                  <CardDescription>
									</CardDescription>
                </CardHeader>
                <CardContent>
									{
										//optimisticExpenses && 
										<TableComponent 
											categories={categories}
											collaborators={collaborators}
											expenses={optimisticExpenses} 
											updateExpenses={updateExpenses}
										/>
									}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}


