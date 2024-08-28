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
import { useRef, useState, useTransition } from "react"
import { createClient } from "@/utils/supabase/client"
import { Category, Expense, Profile, Project } from "@/prisma/prisma-client"
import getExpenses from "@/app/actions/getExpenses"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { DatePicker } from "./DatePicker"
import { Decimal } from "@prisma/client/runtime/library"
import { CategoryPicker } from "./CategoryPicker"
import { UserPicker } from "./UserPicker"
import { User } from "@supabase/supabase-js"
import { useAppStore } from "@/utils/zustand/store"

const zComment = z.string().max(50, {
	message: "Comment must have at most 50 characters.",
})
const zAmount = z.number({
	message: "Not a number"
}).nonnegative({
	message: "Amount cannot be negative"
})

type Props = {
	updateExpenses: UpdateExpenses 
	project: Project | undefined
	user: User | null
	collaborators: Profile[] | undefined
	categories: Category[] | undefined
}
export default function AddExpense({ updateExpenses, project, user, collaborators, categories }: Props) {
  const [ userValue, setUserValue ] = useState("")
	const [ categoryValue, setCategoryValue ] = useState("")
	const [ open, setOpen ] = useState(false)
	const [	date, setDate ] = useState<Date>(new Date())
	const supabase = createClient()
	const [ isPending, startTransition ] = useTransition()
	const commentRef = useRef<HTMLInputElement>(null)
	const amountRef = useRef<HTMLInputElement>(null)
	const { isLoading, setIsLoading } = useAppStore(state => state)

	function amountHandler() {
		if (amountRef.current) {
			const inputValue = amountRef.current.value
			const inputValueNo$ = inputValue.slice(1)
			if (inputValue.length === 1) {
				if (!zAmount.safeParse(Number(inputValue)).success) {
					amountRef.current.value = ''
				} else {
					amountRef.current.value = '$' + amountRef.current.value
				}
			} else {
				if (inputValue.slice(0,1) != '$') {
					if (zAmount.safeParse(Number(inputValue)).success) {
						amountRef.current.value = '$' + amountRef.current.value
					} else {
						amountRef.current.value = ''
					}
				}	else {
					if (!zAmount.safeParse(Number(inputValueNo$)).success) {
						amountRef.current.value = inputValue.slice(0,-1)	
					}
				}
			}
		} 
	} 
	function commentHandler() {
		if (commentRef.current && !zComment.safeParse(commentRef.current?.value).success) {
			commentRef.current.value = commentRef.current?.value.slice(0,-1)
		}
	}

  async function onSubmit(data: FormData) {
		setOpen(false)
		setIsLoading(true)
		const comment = data.get("comment")?.toString()
		const amount = Number(data.get("amount")?.slice(1))
		const testComment = zComment.safeParse(comment)
		const testAmount = zAmount.safeParse(amount)
		if (!testComment.success || !testAmount || !amount) {
			console.log(testComment.error?.issues)
			console.log(testAmount.error?.issues)
			return
		}
		if (!project || !user) {
			if (!project) console.error('No project')
			if (!user) console.error('No user')
			return
		}
		if (!userValue || userValue.length  === 0) {
			return
		}
		if (!categoryValue) {
			console.error("No category selected")
			return
		}
		console.log("userValue: ", userValue)
		//format the date
		const tDate = (date as Date)
		tDate.setHours(4)
		const year = tDate.getFullYear()
		const month = tDate.getMonth() + 1
		const day = tDate.getDate()
		let dayString = day.toString()
		if (day < 10) dayString = '0' + dayString
		let monthString = month.toString()
		if (month < 10) monthString = '0' + monthString
		const newDate = year + '-' + monthString + '-' + dayString 

		const newExpense: Expense = {
				id: Math.random().toString(),
				comment: comment!,
				created_at: new Date(),
				made_by: userValue,
				amount: amount as unknown as Decimal,
				expense_date: newDate as unknown as Date,
				project: project.id, 
				category: categoryValue 
			}
		startTransition(() => updateExpenses({
			action: 'create',
			expense: newExpense 
		}))

		delete (newExpense as { id?: string }).id
		await supabase
			.from('Expense')
			.insert(newExpense)
		await getExpenses()
		setIsLoading(false)
  }
	function handleOpenChange(open: boolean) {
		setOpen(open)
		if (!open) {
			resetModal()
		}
	}
	function resetModal() {
		setDate(new Date())
		setUserValue('')
		setCategoryValue('')
		if (amountRef.current) amountRef.current.value = ''
		if (commentRef.current) commentRef.current.value =''
	}

	return (
		<Dialog data-pending={isPending? "" : undefined} open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild={true} className="h-8 gap-1" disabled={isLoading}>
				<Button size="sm" className={`${isLoading ? 'bg-muted-foreground' : 'bg-foreground'}`} >
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
							className="space-y-4 flex flex-col"
						>	
							<div className="flex flex-col gap-y-2">
								<div className="flex flex-row justify-between gap-4 flex-wrap min-[480px]:flex-nowrap">
									<DatePicker 
										date={date}
										setDate={setDate}
									/>
									<Input 
										type="text" 
										ref={amountRef}
										name="amount" 
										placeholder="Amount" 
										onChange={amountHandler}
									/>
								</div>
							</div>
							<div className="flex flex-row justify-between gap-4 flex-wrap min-[480px]:flex-nowrap">
								<CategoryPicker 
									categories={categories}
									categoryValue={categoryValue}
									setCategoryValue={setCategoryValue}
								/>
								<UserPicker 
									collaborators={collaborators}
									userValue={userValue}
									setUserValue={setUserValue}
								/>
							</div>
							<Input 
								type="text" 
								ref={commentRef} 
								name="comment" 
								placeholder="Comment (optional, 50 chars max)"
								onChange={commentHandler}
							/>
							<Button type="submit">Submit</Button>
						</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}




