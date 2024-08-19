'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ListFilterIcon, FileIcon, CirclePlusIcon, MoveHorizontalIcon } from "./ui/icons"
import { Expense } from "@prisma/client"
import TableComponent from "./TableComponent"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useOptimistic, useTransition } from "react"
import getExpenses from "@/app/actions/getExpenses"

type Props = {
 expenses: Expense[]	| null
}
export default function Dashboard({ expenses }: Props) {
	const supabase = createClient()
	const [ , startTransition ] = useTransition()
	const [ optimisticExpenses, updateExpenses ] = useOptimistic(expenses, 
		(state, {action, expense, id} : 
		{action: string, expense?: Expense, id?: string }) => {
			switch (action) {
				case "create":
					return expense && state ? [...state, expense] : state || []
				case "delete":
					return id && state ? state.filter(e => e.id.toString() != id) : state || []
				case "update":
					const newArr: Expense[] = state?.filter(e => e.id != expense?.id) || []
					return expense ? [...newArr, expense] : state 
				default:
					return state
		}
	})
	
	useEffect(()=>{
		const channel = supabase.channel('expenses')
			.on(
				'postgres_changes', 
				{event: '*', schema: 'public', table: 'Expense'}, 
				payload => {
					if (optimisticExpenses && payload) {
						switch (payload.eventType) {
							case 'INSERT':
								startTransition(()=> updateExpenses({
									action: 'create',
									expense: payload.new as Expense
								}))
								getExpenses()
								break
							case 'UPDATE':
								startTransition(()=> updateExpenses({
									action: 'update',
									expense: payload.new as Expense
								}))
								getExpenses()
								break
							case 'DELETE':
								startTransition(()=> updateExpenses({
									action: 'delete',
									id: (payload.new as Expense).id.toString()
								}))
								getExpenses()
								break
						}
					}
				}).subscribe()
		return () => {
      channel.unsubscribe();
    };
	},[supabase, optimisticExpenses, updateExpenses])

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 overflow-y-hidden">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="archived" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilterIcon className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
											Filter by
										</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
											Active
										</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
											Draft
										</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
											Archived
										</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <FileIcon className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
									 Export
									</span>
                </Button>
                <Button size="sm" className="h-8 gap-1">
                  <CirclePlusIcon className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
										Add Product
									</span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
									</CardDescription>
                </CardHeader>
                <CardContent>
									{
										expenses && 
										<TableComponent expensesFromServer={expenses} />
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

