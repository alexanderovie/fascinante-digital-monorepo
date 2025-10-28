import { redirect } from 'next/navigation';

/**
 * Página de inicio del dashboard
 */
export default function DashboardRootPage() {
  redirect('/dashboard/default');
}
