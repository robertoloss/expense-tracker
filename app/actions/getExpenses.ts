'use server'
import { createClient } from "@/utils/supabase/server"
import { data } from "autoprefixer";
import { revalidatePath } from "next/cache";

const supabase = createClient()

export default async function getExpenses() {
	const { data: { user }, } = await supabase.auth.getUser();

	const { data: Expense } = await supabase
		.from('Expense')
		.select('*')
		.eq('user', user?.id)

	console.log("getExpenses: ", Expense)
	revalidatePath('/dashboard')


	return Expense
}
