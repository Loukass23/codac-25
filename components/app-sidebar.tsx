"use client";

import {
  Users,
  Briefcase,
  Code2,
  LayoutDashboard,
  GraduationCap,
  MessageCircle,
  User2,
} from "lucide-react";
import Link from "next/link";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTotalUnreadCount } from "@/hooks/use-total-unread-count";

import CodacLogo from "./codac-logo";
import { NavSecondary } from "./nav-secondary";
import { NavTop, NavigationGroup } from "./nav-top";
import { NavUser } from "./nav-user";

const buildNavigationData = (role?: string): NavigationGroup[] => {
  // Build career items based on role
  const careerItems = [
    {
      title: "Jobs",
      url: "/career/jobs",
    },
  ];

  // Add career admin items for authorized roles
  if (role === "ADMIN" || role === "MENTOR") {
    careerItems.push({
      title: "Post Job",
      url: "/career/jobs/post",
    });
  }

  // Build learning items based on role
  const learningItems = [

    {
      title: "LMS",
      url: "/lms/welcome",
    },
  ];

  if (role === "ADMIN") {
    learningItems.push({
      title: "Attendance",
      url: "/attendance",
      // icon: ClipboardCheck, // Removed to fix type error: 'icon' does not exist in type
    });
  }

  return [
    {
      title: "Overview",
      icon: LayoutDashboard,
      items: [
        {
          title: "Dashboard",
          url: "/",
        },
      ],
    },
    {
      title: "Projects",
      icon: Code2,
      items: [
        {
          title: "My Projects",
          url: "/projects/my",
        },
        {
          title: "Browse Projects",
          url: "/projects",
        },
        {
          title: "Showcase",
          url: "/showcase",
        },
      ],
    },
    {
      title: "Community",
      icon: Users,
      items: [
        {
          title: "Community",
          url: "/community",
        },
        {
          title: "Cohorts",
          url: "/community/cohorts",
        },
      ],
    },
    {
      title: "Career",
      icon: Briefcase,
      items: careerItems,
    },
    ...(learningItems.length > 0 ? [{
      title: "Learning",
      icon: GraduationCap,
      items: learningItems,
    }] : []),




  ];
};

const navSecondaryItems = [
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User2,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const { totalUnreadCount } = useTotalUnreadCount();
  const [navGroups, setNavGroups] = React.useState(() =>
    buildNavigationData(undefined)
  );

  // Update navigation when user role or unread count changes
  React.useEffect(() => {
    if (session?.user) {
      const userData = session.user as User;
      setNavGroups(buildNavigationData(userData.role));
    }
  }, [session, totalUnreadCount]);

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <Link href="/">

                <CodacLogo
                  size="sm"

                />
                <div className="flex-1 text-left leading-tight group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
                  <span className="font-codac-brand text-2xl uppercase tracking-wider text-codac-pink">
                    codac
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-0 flex flex-col">
        <div className="flex-1">
          <NavTop groups={navGroups} />
        </div>
        <div className="mt-auto">
          <NavSecondary items={navSecondaryItems} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
