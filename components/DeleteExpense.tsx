import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UpdateExpenses } from "./Dashboard"
import { useState, useTransition } from "react"
import { createClient } from "@/utils/supabase/client"
import getExpenses from "@/app/actions/getExpenses"
import { Expense } from "@/prisma/prisma-client"


type Props = {
	expense: Expense
	updateExpenses: UpdateExpenses
}
export default function DeleteExpense({ expense, updateExpenses }: Props) {
	const [ , startTransition ] = useTransition()
	const [ open, setOpen ] = useState(false)
	const supabase = createClient()
	async function deleteExpense(expense: Expense) {
		startTransition(()=>updateExpenses({
			action: 'delete',
			id: expense.id.toString()
		}))
		await supabase
			.from('Expense')
			.delete()
			.eq('id', expense.id)
		getExpenses()
		setOpen(false)
	}

	return (
		<AlertDialog open={open} onOpenChange={(open: boolean)=>setOpen(open)}>
			<AlertDialogTrigger >
				<h1 className="flex flex-row w-full">Delete</h1>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this expense from your account
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction asChild={true}>
						<form action={()=>deleteExpense(expense)}>
							<button type="submit">
								Continue
							</button>
						</form>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
