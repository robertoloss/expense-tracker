import { Expense } from "@prisma/client"
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table"
import { UpdateExpenses } from "./Dashboard"
import TableRowComp from "./TableRowComp"
import { v4 as uuidv4 } from 'uuid';

type Props = {
	expenses: Expense[] | null
	updateExpenses: UpdateExpenses
}
export default function TableComponent({ expenses, updateExpenses } : Props) {

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
				{expenses?.map(expense => 
					<TableRowComp 
						key={uuidv4()} 
						expense={expense} 
						updateExpenses={updateExpenses}
					/>
				)}
			</TableBody>
		</Table>
	)
}
