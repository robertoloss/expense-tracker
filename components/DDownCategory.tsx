
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Category } from "@/prisma/prisma-client"


type Props = {
	categories: Category[] | undefined
	handleCategoryChange: (s: string)=>void
}
export default function DDownCategory({ handleCategoryChange, categories } : Props) {
	return (
		<Select 
			onValueChange={handleCategoryChange}
			defaultValue="allCategories"
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="xxx" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="allCategories">
						All
					</SelectItem>
					{categories?.map(category => (
						<SelectItem 
							value={category.name}
							key={category.id}
						>
							{category.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
