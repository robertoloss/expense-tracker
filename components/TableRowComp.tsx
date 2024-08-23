import { TableRow, TableCell } from "@/components/ui/table"
import { Expense } from "@prisma/client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "./ui/badge"
import { Button } from "@/components/ui/button"
import { MoveHorizontalIcon } from "./ui/icons"
import DeleteExpense from "./DeleteExpense"
import { UpdateExpenses } from "./Dashboard"

type Props = {
	expense: Expense
	updateExpenses: UpdateExpenses
}
export default function TableRowComp({ expense, updateExpenses }: Props) {
	const date = new Date(expense?.expense_date as Date)
	const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
	const formattedDate = date.toLocaleDateString('en-US', options);

	return (
		<TableRow>
			<TableCell className="font-medium">{expense.kind}</TableCell>
			<TableCell>
				<Badge variant="outline">{expense.kind}</Badge>
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
