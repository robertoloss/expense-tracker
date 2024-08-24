import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table"
import { UpdateExpenses } from "./Dashboard"
import TableRowComp from "./TableRowComp"
import { v4 as uuidv4 } from 'uuid';
import { Expense, Profile } from "@/prisma/prisma-client";

type Props = {
	expenses: Expense[] | null | undefined
	updateExpenses: UpdateExpenses
	collaborators: Profile[] | null
}
export default function TableComponent({ expenses, updateExpenses, collaborators } : Props) {

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="hidden md:table-cell">Price</TableHead>
					<TableHead className="hidden md:table-cell">Date</TableHead>
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
						collaborators={collaborators}
					/>
				)}
			</TableBody>
		</Table>
	)
}
