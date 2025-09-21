"use client";

import {
  Users,
  Briefcase,
  Code2,
  LayoutDashboard,
  GraduationCap,
  MessageCircle,
  User2,
  BookOpen,
  Database,
  TrendingUp,
  Settings,
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
      title: "LMS Overview",
      url: "/lms",
    },
    {
      title: "Welcome",
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

    // Separate LMS groups for better organization
    ...(role === "ADMIN" || role === "MENTOR" || role === "STUDENT" ? [
      {
        title: "Web Development",
        icon: BookOpen,
        items: [
          { title: "Overview", url: "/lms/web" },
          { title: "Module 1", url: "/lms/web/Module-1" },
          { title: "Module 2", url: "/lms/web/Module-2" },
          { title: "Module 3", url: "/lms/web/Module-3" },
        ],
      },
      {
        title: "Data Science",
        icon: Database,
        items: [
          { title: "Overview", url: "/lms/data" },
          { title: "Module 1", url: "/lms/data/Module-1" },
          { title: "Module 2", url: "/lms/data/Module-2" },
          { title: "Module 3", url: "/lms/data/Module-3" },
          { title: "ML Fundamentals", url: "/lms/data/Machine-Learning-Fundamentals" },
          { title: "Tableau", url: "/lms/data/Tableau" },
        ],
      },
      {
        title: "Career Services",
        icon: TrendingUp,
        items: [
          { title: "Overview", url: "/lms/career" },
          { title: "Step 1", url: "/lms/career/Step-1" },
          { title: "Step 2", url: "/lms/career/Step-2" },
          { title: "Step 3", url: "/lms/career/Step-3" },
        ],
      },
    ] : []),

    // Admin-only content
    ...(role === "ADMIN" ? [
      {
        title: "Admin",
        icon: Settings,
        items: [
          { title: "Guidelines", url: "/lms/guidelines" },
        ],
      },
    ] : []),

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
