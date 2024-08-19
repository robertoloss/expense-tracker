'use client'
import { Expense } from "@prisma/client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoveHorizontalIcon } from "./ui/icons"
import { useEffect, useOptimistic, useState, useTransition } from "react"
import { createClient } from "@/utils/supabase/client"
import getExpenses from "@/app/actions/getExpenses"

type Props = {
	expensesFromServer: Expense[] | null
}
export default function TableComponent({ expensesFromServer } : Props) {
	const supabase = createClient()
	//const [ expenses, setExpenses ] = useState(expensesFromServer) 
	const [ , startTransition ] = useTransition()
	const [ optimisticExpenses, updateExpenses ] = useOptimistic(expensesFromServer, 
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
				//payload => {
				//	if (expenses && payload.new) {
				//		let newExpenses: Expense[] | null = []
				//		switch (payload.eventType) {
				//			case 'INSERT':
				//				newExpenses = [...expenses, payload.new as Expense];
				//				setExpenses(newExpenses);
				//				getExpenses()
				//				break
				//			case 'UPDATE':
				//				const tmpExpenses = expenses.filter(e => e.id != (payload.new as Expense).id ); 
				//				newExpenses = [...tmpExpenses, payload.new as Expense];
				//				setExpenses(newExpenses)
				//				getExpenses()
				//				break
				//			case 'DELETE':
				//				newExpenses = expenses.filter(e => e.id != (payload.old as Expense).id ); 
				//				console.log("newExpenses: ", newExpenses)
				//				setExpenses(newExpenses)
				//				getExpenses()
				//				break
				//		}
				//	}
				//}).subscribe()

		return () => {
      channel.unsubscribe();
    };
	},[supabase, expenses, setExpenses])

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="hidden md:table-cell">Price</TableHead>
					<TableHead className="hidden md:table-cell">Created at</TableHead>
					<TableHead>
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>

				{optimisticExpenses?.map(expense => {
					const date = new Date(expense.created_at)
					const year = date.getFullYear()
					const month = String(date.getMonth() + 1).padStart(2, '0');
					const day = String(date.getDate()).padStart(2, '0');
					const hours = String(date.getHours()).padStart(2, '0');
					const minutes = String(date.getMinutes()).padStart(2, '0');					

					return <TableRow key={expense.id}>
						<TableCell className="font-medium">{expense.kind}</TableCell>
						<TableCell>
							<Badge variant="outline">{expense.kind}</Badge>
						</TableCell>
						<TableCell className="hidden md:table-cell">
							${expense.amount?.toString()}
						</TableCell>
						<TableCell className="hidden md:table-cell">{`${year}-${month}-${day} ${hours}:${minutes}`}</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button aria-haspopup="true" size="icon" variant="ghost">
										<MoveHorizontalIcon className="h-4 w-4" />
										<span className="sr-only">Toggle menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuItem>Edit</DropdownMenuItem>
									<DropdownMenuItem>Delete</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				})}

			</TableBody>
		</Table>
	)
}
