import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type Props = {
	handlePeriodChange: (s: string)=>void
}
export default function DDownPeriod({ handlePeriodChange } : Props) {
	return (
		<Select 
			onValueChange={handlePeriodChange}
			defaultValue="all"
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="xx" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="thisMonth">This Month</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
