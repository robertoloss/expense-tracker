import Dashboard from "@/components/Dashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic' // 
export default async function ProtectedPage() {
  const supabase = createClient();
  const { data: { user }, } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
	console.log("hello")
	const { data: Expenses, error } = await supabase
		.from('Expenses')
		.select('*')
		.eq('user',user.id)

  return (
			<Dashboard expenses={Expenses}/>
  );
}
