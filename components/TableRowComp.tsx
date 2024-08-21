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
	const date = new Date(expense.created_at)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');					

	return (
		<TableRow>
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
