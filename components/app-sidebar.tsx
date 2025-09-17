"use client";

import {
  Users,
  BookOpen,
  MessageCircle,
  Home,
  User as UserIcon,
  GraduationCap,
  Pyramid,
  Folder,
} from "lucide-react";
import Image from "next/image";
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

import { NavTop } from "./nav-top";
import { NavUser } from "./nav-user";

const buildNavigationData = (_userRole?: string, unreadCount?: number) => {
  const baseNavigation = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: UserIcon,
    },
  ];

  const communityNavigation = [
    {
      title: "Community",
      url: "/community",
      icon: Users,
    },
    {
      title: "Mentorship",
      url: "/mentorship",
      icon: BookOpen,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Folder,
    },
  ];

  const learningNavigation = [
    {
      title: "Learning",
      url: "/learning",
      icon: GraduationCap,
    },
    {
      title: "Quizzes",
      url: "/learning/quiz",
      icon: Pyramid,
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageCircle,
      badge:
        unreadCount && unreadCount > 0 ? unreadCount.toString() : undefined,
    },
  ];

  return {
    navTop: [...baseNavigation, ...communityNavigation, ...learningNavigation],
    navSecondary: [],
    footer: [],
  };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const { totalUnreadCount } = useTotalUnreadCount();
  const [navData, setNavData] = React.useState(() =>
    buildNavigationData(undefined, 0)
  );

  // Update navigation when user role or unread count changes
  React.useEffect(() => {
    if (session?.user) {
      const userData = session.user as User;
      setNavData(buildNavigationData(userData.role, totalUnreadCount));
    } else {
      setNavData(buildNavigationData(undefined, totalUnreadCount));
    }
  }, [session, totalUnreadCount]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <Link href="/">
                <Image
                  src={"/codac_logo.svg"}
                  alt="codac logo"
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                <div className="flex-1 text-left leading-tight group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
                  <span className="font-codac-brand text-2xl uppercase tracking-wider text-primary">
                    codac
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-0">
        <NavTop items={[...navData.navTop, ...navData.navSecondary]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
