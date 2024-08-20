import Dashboard from "@/components/Dashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import getExpenses from "../actions/getExpenses";

export const dynamic = 'force-dynamic' 

export default async function ProtectedPage() {
  const supabase = createClient();
  const { data: { user }, } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
	const expenses = await getExpenses() 
	
	console.log("Number of expenses: ", expenses?.length)

  return (
		<Dashboard expenses={expenses}/>
  );
}
