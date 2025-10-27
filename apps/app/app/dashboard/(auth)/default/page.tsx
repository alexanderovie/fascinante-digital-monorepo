import {
  ChatWidget,
  ExerciseMinutes,
  LatestPayments,
  PaymentMethod,
  Subscriptions,
  ThemeMembers,
  TotalRevenue
} from "./components";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <TotalRevenue />
            <ExerciseMinutes />
          </div>
          <div className="space-y-4">
            <LatestPayments />
            <Subscriptions />
          </div>
          <div className="space-y-4">
            <ChatWidget />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              <PaymentMethod />
              <ThemeMembers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
