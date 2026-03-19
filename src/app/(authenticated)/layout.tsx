import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AuthErrorBoundary from "@/components/layout/AuthErrorBoundary";
import AuthDataProvider from "@/components/auth/AuthDataProvider";

function ContentLoading() {
  return (
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
  );
}

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  return (
    <AuthErrorBoundary>
      <div className="flex min-h-screen bg-dark">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 lg:p-8">
            <Suspense fallback={<ContentLoading />}>
              <AuthDataProvider
                userId={session.user.id}
                email={session.user.email ?? ""}
                name={session.user.name ?? ""}
                image={session.user.image ?? undefined}
              >
                {children}
              </AuthDataProvider>
            </Suspense>
          </main>
        </div>
      </div>
    </AuthErrorBoundary>
  );
}
