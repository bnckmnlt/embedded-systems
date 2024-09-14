"use client";

import { useMQTT } from "@/components/hooks/useMQTT";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Triangle,
  SearchIcon,
  LayoutDashboard,
  Bot,
  Settings,
  LifeBuoy,
  SquareUser,
  LucideIcon,
  Microchip,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MQTTContext } from "./mqtt-provider";

interface SidebarLinkProps {
  href: String;
  icon: LucideIcon;
  label: String;
}

const sidebarLinks = [
  {
    href: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/sensors",
    icon: Microchip,
    label: "Sensors",
  },
  {
    href: "/playground",
    icon: Bot,
    label: "Playground",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`${href}`}>
          <Button
            variant={"ghost"}
            size={"icon"}
            className={isActive ? "rounded-lg bg-muted" : ""}
            aria-label="Dashboard"
          >
            <Icon className="size-5" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

const DashboardLayout: React.FC<DashboardProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="grid h-screen w-full pl-[53px]">
      <aside className="fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant={"outline"} size={"icon"} aria-label="Home">
            <Microchip className="size-5 rotate-45" />
          </Button>
        </div>
        <TooltipProvider>
          <nav className="grid gap-1 p-2">
            {sidebarLinks.map(({ href, icon: Icon, label }) => (
              <SidebarLink key={href} href={href} icon={Icon} label={label} />
            ))}
          </nav>
          <nav className="mt-auto grid gap-1 p-2">
            <SidebarLink href={"/help"} icon={LifeBuoy} label={"Help"} />
            <SidebarLink
              href={"/account"}
              icon={SquareUser}
              label={"Account"}
            />
          </nav>
        </TooltipProvider>
      </aside>
      <main className="flex w-full flex-col">
        <header className="sticky top-0 z-10 flex h-[53px] items-center justify-between gap-1 border-b bg-background px-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex flex-row gap-2">
            <div className="relative hidden md:block">
              <Input className="pl-10" />
              <div className="absolute inset-y-0 flex items-center pl-3">
                <SearchIcon className="size-4 text-muted-foreground" />
              </div>
            </div>
            <ModeToggle />
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

interface DashboardProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const topics = [
  "raspi/board/data",
  "raspi/board/status",
  "raspi/sensors/dht11/status",
  "raspi/sensors/dht11/data",
  "raspi/sensors/hc-sr04/status",
  "raspi/sensors/hc-sr04/data",
  "raspi/sensors/hc-sr04/2/status",
  "raspi/sensors/hc-sr04/2/data",
];

const DashboardWrapper: React.FC<DashboardProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { connectionStatus, data, clientRef } = useMQTT({ topics });

  return (
    <QueryClientProvider client={queryClient}>
      <MQTTContext.Provider value={{ connectionStatus, data, clientRef }}>
        <DashboardLayout>{children}</DashboardLayout>
      </MQTTContext.Provider>
    </QueryClientProvider>
  );
};

export default DashboardWrapper;
