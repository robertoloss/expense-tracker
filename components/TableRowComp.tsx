import { TableRow, TableCell } from "@/components/ui/table"
import { Expense, Profile } from "@/prisma/prisma-client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "./ui/badge"
import { Button } from "@/components/ui/button"
import { MoveHorizontalIcon } from "./ui/icons"
import DeleteExpense from "./DeleteExpense"
import { UpdateExpenses } from "./Dashboard"

type Props = {
	expense: Expense
	updateExpenses: UpdateExpenses
	collaborators: Profile[] | null
}
export default function TableRowComp({ expense, updateExpenses, collaborators }: Props) {
	const dateParts = (expense?.expense_date).toString().split('-');
	const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
	const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
	const formattedDate = date.toLocaleDateString('en-US', options);
	const collaboratorArr = collaborators?.filter(c => c.id === expense.made_by) || []
	let collaborator: Profile | null = null
	if (collaboratorArr.length > 0) collaborator = collaboratorArr[0]

	return (
		<TableRow>
			<TableCell className="font-medium">{collaborator?.first_name} {collaborator?.last_name}</TableCell>
			<TableCell>
				<Badge variant="outline">{expense.comment}</Badge>
			</TableCell>
			<TableCell className="hidden md:table-cell">
				${expense.amount?.toString()}
			</TableCell>
			<TableCell className="hidden md:table-cell">{`${formattedDate}`}</TableCell>
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
						<DropdownMenuItem>
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={(e)=>e.preventDefault()}>
							<DeleteExpense 
								expense={expense}
								updateExpenses={updateExpenses}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	)
}
