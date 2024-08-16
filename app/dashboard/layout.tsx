import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"

type Props = {
	children: React.ReactNode
}
export default function DashboardLayout({ children } : Props) {

	return (
		<div className="w-full">
			<Sidebar />
			<div className=" w-full h-full ">
				<Header />
				<div className="flex flex-col w-full h-full overflow-hidden">
					{ children }
				</div>
			</div>
		</div>
	)
}
