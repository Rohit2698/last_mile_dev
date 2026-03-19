import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { RoleCards } from "@/components/role-cards";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main >
        <HeroSection />
        <RoleCards />
      </main>
      <footer className="w-full border-t py-6 bg-background">
        <div className="container px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 LastMile. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
