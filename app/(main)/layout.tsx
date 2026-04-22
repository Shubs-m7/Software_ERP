import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/components/auth/role-guard"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8 bg-muted/20">
          <RoleGuard>
            {children}
          </RoleGuard>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
