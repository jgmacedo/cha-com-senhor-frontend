"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Coffee, BookOpen, User, Settings, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { ThemeToggle, ThemeToggleWithLabel } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: "Devocional", href: "/dashboard", icon: BookOpen },
    { name: "Perfil", href: "/dashboard/profile", icon: User },
    ...(isAdmin
      ? [{ name: "Administração", href: "/admin", icon: Settings }]
      : []),
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-bg-100 transition-colors duration-300">
      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="gradient-header text-white w-full max-w-[16rem] p-0"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-6 border-b border-white/20">
              <Coffee className="h-6 w-6" />
              <h2 className="text-xl font-bold">Chá Com o Senhor</h2>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-white/20 space-y-2">
              <ThemeToggleWithLabel />
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sair
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 gradient-header text-white">
          <div className="flex items-center gap-2 h-16 px-6 border-b border-white/20">
            <Coffee className="h-6 w-6" />
            <h2 className="text-xl font-bold">Chá Com o Senhor</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-white/20 space-y-2">
              <ThemeToggleWithLabel />
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 transition-all duration-300">
        <header className="bg-white dark:bg-primary-300/10 shadow-soft transition-colors duration-300">
          <div className="pl-12 pr-4 py-6 sm:pl-12 sm:pr-6 md:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-300 transition-colors duration-300">
              {pathname === "/dashboard" && "Devocional Diário"}
              {pathname === "/dashboard/profile" && "Meu Perfil"}
              {pathname === "/admin" && "Painel Administrativo"}
            </h1>
            <div className="md:hidden">{mounted && <ThemeToggle />}</div>
          </div>
        </header>
        <main className="p-4 sm:p-6 md:p-8 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
