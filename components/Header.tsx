'use client'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { Button } from "./ui/button"
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage, BreadcrumbLink } from "./ui/breadcrumb"
import { Input } from "./ui/input"
import { PanelLeftIcon, HomeIcon, SearchIcon, LineChartIcon, PackageIcon, Package2Icon, ShoppingCartIcon, UsersIcon } from "./ui/icons"



export default function Header() {

	return (
		<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button size="icon" variant="outline" className="sm:hidden">
						<PanelLeftIcon className="h-5 w-5" />
						<span className="sr-only">Toggle Menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="sm:max-w-xs">
					<nav className="grid gap-6 text-lg font-medium">
						<Link
							href="#"
							className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
							prefetch={false}
						>
							<Package2Icon className="h-5 w-5 transition-all group-hover:scale-110" />
							<span className="sr-only">Acme Inc</span>
						</Link>
						<Link
							href="#"
							className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
							prefetch={false}
						>
							<HomeIcon className="h-5 w-5" />
							Dashboard
						</Link>
						<Link
							href="#"
							className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
							prefetch={false}
						>
							<ShoppingCartIcon className="h-5 w-5" />
							Orders
						</Link>
						<Link href="#" className="flex items-center gap-4 px-2.5 text-foreground" prefetch={false}>
							<PackageIcon className="h-5 w-5" />
							Products
						</Link>
						<Link
							href="#"
							className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
							prefetch={false}
						>
							<UsersIcon className="h-5 w-5" />
							Customers
						</Link>
						<Link
							href="#"
							className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
							prefetch={false}
						>
							<LineChartIcon className="h-5 w-5" />
							Settings
						</Link>
					</nav>
				</SheetContent>
			</Sheet>
			<Breadcrumb className="hidden md:flex">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="#" prefetch={false}>
								Dashboard
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="#" prefetch={false}>
								Products
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>All Products</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="relative ml-auto flex-1 md:grow-0">
				<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search..."
					className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
				/>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon" className="overflow-hidden rounded-full">
						<img
							src="/placeholder.svg"
							width={36}
							height={36}
							alt="Avatar"
							className="overflow-hidden rounded-full"
						/>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuItem>Support</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	)
}
