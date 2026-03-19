export default function AuthenticatedLoading() {
  return (
    <div className="flex-1 p-4 lg:p-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-dark-card rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-48 bg-dark-card rounded-xl" />
            <div className="h-32 bg-dark-card rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-dark-card rounded-xl" />
            <div className="h-24 bg-dark-card rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
