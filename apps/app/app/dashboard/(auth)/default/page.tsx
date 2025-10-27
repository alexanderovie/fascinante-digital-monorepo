import { redirect } from "next/navigation";

export default function Page() {
  // Redirect to AI Chat V2 as the default page
  redirect("/dashboard/apps/ai-chat-v2");
}
