import { Expense } from "@prisma/client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoveHorizontalIcon } from "./ui/icons"

type Props = {
	expensesFromServer: Expense[] | null
}
export default function TableComponent({ expensesFromServer } : Props) {

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

				{expensesFromServer?.map(expense => {
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
