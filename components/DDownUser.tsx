import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Profile } from "@/prisma/prisma-client"


type Props = {
	handleUserChange: (s: string)=>void
	users: Profile[] | undefined
}
export default function DDownUser({ handleUserChange, users } : Props) {
	return (
		<Select 
			onValueChange={handleUserChange}
			defaultValue="all"
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="all">
						All
					</SelectItem>
					{users?.map(user => {
						const userName = (user.first_name && user.last_name) ? (user.first_name + ' ' + user.last_name) : 'anon'
						return <SelectItem 
							value={user.id}
							key={user.id}
						>
							{userName}
						</SelectItem>
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
