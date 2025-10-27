import { redirect } from 'next/navigation';

/**
 * Página de inicio del dashboard - Redirige a AI-Chat V2
 */
export default function DashboardRootPage() {
  redirect('/dashboard/apps/ai-chat-v2');
}
