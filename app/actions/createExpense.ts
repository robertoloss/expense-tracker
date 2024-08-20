'use server'
import { createClient } from "@/utils/supabase/server"

const supabase = createClient()

export default async function createExpense(username: string) {
	const { data, error } = await supabase.from('Expense')
		.insert([
			{kind: username}
		])
		.select()
}
