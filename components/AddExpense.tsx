import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { CirclePlusIcon } from "./ui/icons"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { UpdateExpenses } from "./Dashboard"
import { useState, useTransition } from "react"
import { createClient } from "@/utils/supabase/client"
import { Expense } from "@prisma/client"
import getExpenses from "@/app/actions/getExpenses"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { DatePicker } from "./DatePicker"

const zUsername = z.string().min(2, {
    message: "Username must be at least 2 characters.",
  })

type Props = {
	updateExpenses: UpdateExpenses 
}
export default function AddExpense({ updateExpenses }: Props) {
	const [ open, setOpen ] = useState(false)
	const [date, setDate] = useState<Date | undefined>(new Date())
	const supabase = createClient()
	const [ , startTransition ] = useTransition()

  async function onSubmit(data: FormData) {
		const username = data.get("username")?.toString()
		const testUsername = zUsername.safeParse(username)
		if (!testUsername.success) {
			console.log(testUsername.error.issues)
			return
		}
		const newExpense: Expense = {
				id: BigInt(9999),
				kind: data.get("username")?.toString() || "null",
				created_at: new Date(),
				user: '197f73a9-0499-4b6c-8283-38cc8d4d0d9c',
				amount: null,
				expense_date: date as Date || null,
			}
		startTransition(()=>updateExpenses({
			action: 'create',
			expense: newExpense 
		}))
		delete (newExpense as { id?: bigint }).id
		await supabase
			.from('Expense')
			.insert(newExpense)
		getExpenses()
		setOpen(false)
  }

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild={true} className="h-8 gap-1">
				<Button size="sm" >
					<CirclePlusIcon className="h-3.5 w-3.5" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
						Add Expense
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent aria-describedby="dialog-description">
				<DialogHeader>
					<DialogTitle>Add a new expense</DialogTitle>
					<DialogDescription>
						<VisuallyHidden>
							Description goes here
						</VisuallyHidden>
					</DialogDescription>
						<form
							action={onSubmit}
							className="space-y-8"
						>	
							<DatePicker 
								date={date}
								setDate={setDate}
							/>
							<Input type="text" name="username" placeholder="kind"/>
							<Button type="submit">Submit</Button>
						</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}




