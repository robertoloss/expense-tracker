import getProject from "@/app/actions/getProject";
import getProjectCategories from "@/app/actions/getProjectCategories";
import getProjectCollaborators from "@/app/actions/getProjectCollaborators";
import getProjectExpenses from "@/app/actions/getProjectExpenses";
import Dashboard from "@/components/Dashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic' 

type Props = {
	params: {
		id: string
	}
}
export default async function TablePage({ params }: Props) {
  const supabase = createClient();
  const { data: { user }, } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
	const pId = { projectId: params.id}
	const [ expenses, collaborators, project, categories ] = await Promise.all([
		getProjectExpenses(pId),
		getProjectCollaborators(pId),
		getProject(pId),
		getProjectCategories(pId)
	])
	
  return (
		<Dashboard 
			expenses={expenses} 
			user={user}
			collaborators={collaborators}
			project={project}
			categories={categories}
		/>
  );
}
