import { DashboardRouter } from "./comp/IndexComponent";
import { getAuthUser } from "../api/lib/auth";

export default async function DashboardPage() {
  const auth = await getAuthUser(); 
  return <DashboardRouter user={auth} />; 
}