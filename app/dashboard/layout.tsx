import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"

type Props = {
	children: React.ReactNode
}
export default function DashboardLayout({ children } : Props) {

	return (
		<div className="w-full flex flex-row">
			<Sidebar />
			<div className="flex flex-col w-full">
				<Header />
				{ children }
			</div>
		</div>
	)
}
