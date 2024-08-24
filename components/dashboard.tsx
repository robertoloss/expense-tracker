'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ListFilterIcon, FileIcon } from "./ui/icons"
import { Expense, Profile, Project } from "@/prisma/prisma-client"
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
}
export default function Dashboard({ expenses, user }: Props)  {
	const [ project, setProject ] = useState<Project | null>(null)
	const [ collaborators, setCollaborators ] = useState<Profile[] | null>(null)
	const supabase = createClient()
	const [ optimisticExpenses, updateExpenses ] = useOptimistic(expenses, 
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

	async function selectProject() {
		const { data, error } = await supabase
			.from('Project')
			.select('*')
			.eq('creator', user?.id);
		if (error) {
			console.log(error)
			return
		}
		if (data && data.length > 0) {
			setProject(data[0])
		}
	}
	useEffect(()=>{	
		selectProject()
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

	async function getCollaborators() {
		if (expenses) {
			const profile_ids = expenses.filter(e=>e.made_by).map(e=>e.made_by)
			let colls: Profile[] = []
			const { data } : { data: Profile[] | null } = await supabase
				.from('Profile')
				.select('*')
				.in('id', profile_ids)
			if (!data) setCollaborators(colls)
			else return setCollaborators(data)
		}
	}
	async function getCategories() {
	}
	useEffect(()=>{	
		getCollaborators()
	},[expenses])


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 overflow-y-hidden">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center gap-x-10">
							{
								project && 
								<h1 className="font-semibold text-2xl hidden lg:block">
									{project.name}
								</h1> 
							}
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
								<AddExpense 
									collaborators={collaborators}
									updateExpenses={updateExpenses}
									project={project}
									user={user}
								/>	
              </div>
            </div>
            <TabsContent value="all">
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


