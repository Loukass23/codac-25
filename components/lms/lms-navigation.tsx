"use client";

import { BookOpen, Database, TrendingUp, ChevronRight, ChevronDown, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useCallback } from "react";

import { cn } from "@/lib/utils/utils";

interface NavigationItem {
    title: string;
    url: string;
    children?: NavigationItem[];
}

interface NavigationGroup {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: NavigationItem[];
}

const buildLMSNavigation = (): NavigationGroup[] => [
    {
        title: "Web Development",
        icon: BookOpen,
        items: [
            { title: "Overview", url: "/lms/web" },
            {
                title: "Module 1",
                url: "/lms/web/Module-1",
                children: [
                    { title: "Free APIs", url: "/lms/web/Module-1/Free-APIs" },
                    {
                        title: "Project 1",
                        url: "/lms/web/Module-1/Project-1",
                        children: [
                            { title: "Resources", url: "/lms/web/Module-1/Project-1/Resources" },
                            { title: "Sprint 1", url: "/lms/web/Module-1/Project-1/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/web/Module-1/Project-1/Sprint-2" },
                        ]
                    },
                    {
                        title: "Project 2",
                        url: "/lms/web/Module-1/Project-2",
                        children: [
                            { title: "Resources", url: "/lms/web/Module-1/Project-2/Resources" },
                            { title: "Sprint 1", url: "/lms/web/Module-1/Project-2/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/web/Module-1/Project-2/Sprint-2" },
                            { title: "Sprint 3", url: "/lms/web/Module-1/Project-2/Sprint-3" },
                            { title: "Sprint 4", url: "/lms/web/Module-1/Project-2/Sprint-4" },
                        ]
                    },
                    {
                        title: "Project 3",
                        url: "/lms/web/Module-1/Project-3",
                        children: [
                            { title: "Resources", url: "/lms/web/Module-1/Project-3/Resources" },
                            { title: "Sprint 1", url: "/lms/web/Module-1/Project-3/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/web/Module-1/Project-3/Sprint-2" },
                            { title: "Sprint 3", url: "/lms/web/Module-1/Project-3/Sprint-3" },
                            { title: "Sprint 4", url: "/lms/web/Module-1/Project-3/Sprint-4" },
                        ]
                    },
                ]
            },
            {
                title: "Module 2",
                url: "/lms/web/Module-2",
                children: [
                    {
                        title: "Project 1",
                        url: "/lms/web/Module-2/Project-1",
                        children: [
                            { title: "MERN Deployment", url: "/lms/web/Module-2/Project-1/MERN-deployment" },
                            { title: "Sprint 1", url: "/lms/web/Module-2/Project-1/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/web/Module-2/Project-1/Sprint-2" },
                            { title: "Sprint 3", url: "/lms/web/Module-2/Project-1/Sprint-3" },
                            { title: "Sprint 4", url: "/lms/web/Module-2/Project-1/Sprint-4" },
                        ]
                    },
                ]
            },
            {
                title: "Module 3",
                url: "/lms/web/Module-3",
                children: [
                    {
                        title: "GraphQL",
                        url: "/lms/web/Module-3/GraphQL",
                        children: [
                            { title: "Client", url: "/lms/web/Module-3/GraphQL/Client" },
                        ]
                    },
                    {
                        title: "TypeScript",
                        url: "/lms/web/Module-3/TypeScript",
                        children: [
                            { title: "Basics", url: "/lms/web/Module-3/TypeScript/Basics" },
                            { title: "React", url: "/lms/web/Module-3/TypeScript/React" },
                        ]
                    },
                ]
            },
        ],
    },
    {
        title: "Data Science",
        icon: Database,
        items: [
            { title: "Overview", url: "/lms/data" },
            { title: "ML Fundamentals", url: "/lms/data/Machine-Learning-Fundamentals" },
            { title: "Tableau", url: "/lms/data/Tableau" },
            {
                title: "Module 1",
                url: "/lms/data/Module-1",
                children: [
                    {
                        title: "Project 1",
                        url: "/lms/data/Module-1/Project-1",
                        children: [
                            { title: "Resources", url: "/lms/data/Module-1/Project-1/Resources" },
                            { title: "Sprint 1", url: "/lms/data/Module-1/Project-1/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/data/Module-1/Project-1/Sprint-2" },
                            { title: "Sprint 3", url: "/lms/data/Module-1/Project-1/Sprint-3" },
                            { title: "Sprint 4", url: "/lms/data/Module-1/Project-1/Sprint-4" },
                        ]
                    },
                    {
                        title: "Project 2",
                        url: "/lms/data/Module-1/Project-2",
                        children: [
                            { title: "Sprint 1", url: "/lms/data/Module-1/Project-2/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/data/Module-1/Project-2/Sprint-2" },
                            { title: "Sprint 3", url: "/lms/data/Module-1/Project-2/Sprint-3" },
                            { title: "Sprint 4", url: "/lms/data/Module-1/Project-2/Sprint-4" },
                            { title: "Sprint 5", url: "/lms/data/Module-1/Project-2/Sprint-5" },
                        ]
                    },
                    {
                        title: "Project 3",
                        url: "/lms/data/Module-1/Project-3",
                        children: [
                            { title: "Sprint 1", url: "/lms/data/Module-1/Project-3/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/data/Module-1/Project-3/Sprint-2" },
                            { title: "Sprint 3", url: "/lms/data/Module-1/Project-3/Sprint-3" },
                        ]
                    },
                    {
                        title: "Project 4",
                        url: "/lms/data/Module-1/Project-4",
                        children: [
                            { title: "Sprint 1", url: "/lms/data/Module-1/Project-4/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/data/Module-1/Project-4/Sprint-2" },
                        ]
                    },
                ]
            },
            {
                title: "Module 2",
                url: "/lms/data/Module-2",
                children: [
                    {
                        title: "Project 5",
                        url: "/lms/data/Module-2/Project-5",
                        children: [
                            { title: "Sprint 1", url: "/lms/data/Module-2/Project-5/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/data/Module-2/Project-5/Sprint-2" },
                            { title: "Sprint 3", url: "/lms/data/Module-2/Project-5/Sprint-3" },
                        ]
                    },
                ]
            },
            {
                title: "Module 3",
                url: "/lms/data/Module-3",
                children: [
                    {
                        title: "Project 6",
                        url: "/lms/data/Module-3/Project-6",
                        children: [
                            { title: "Sprint 1", url: "/lms/data/Module-3/Project-6/Sprint-1" },
                            { title: "Sprint 2", url: "/lms/data/Module-3/Project-6/Sprint-2" },
                            { title: "Sprint 3", url: "/lms/data/Module-3/Project-6/Sprint-3" },
                        ]
                    },
                    { title: "Resources", url: "/lms/data/Module-3/Resources" },
                ]
            },
        ],
    },
    {
        title: "Career Services",
        icon: TrendingUp,
        items: [
            { title: "Overview", url: "/lms/career" },
            {
                title: "Step 1",
                url: "/lms/career/Step-1",
                children: [
                    { title: "Chapter 1", url: "/lms/career/Step-1/Chapter-1" },
                    { title: "Chapter 2", url: "/lms/career/Step-1/Chapter-2" },
                    { title: "Chapter 3", url: "/lms/career/Step-1/Chapter-3" },
                    { title: "Chapter 4", url: "/lms/career/Step-1/Chapter-4" },
                ]
            },
            {
                title: "Step 2",
                url: "/lms/career/Step-2",
                children: [
                    { title: "Task 1", url: "/lms/career/Step-2/Task-1" },
                    { title: "Task 2", url: "/lms/career/Step-2/Task-2" },
                    { title: "Task 3", url: "/lms/career/Step-2/Task-3" },
                ]
            },
            {
                title: "Step 3",
                url: "/lms/career/Step-3",
                children: [
                    { title: "Task 1", url: "/lms/career/Step-3/Task-1" },
                    { title: "Task 2", url: "/lms/career/Step-3/Task-2" },
                ]
            },
        ],
    },
    {
        title: "Admin",
        icon: Settings,
        items: [
            { title: "Guidelines", url: "/lms/guidelines" },
        ],
    },

];

interface NavigationItemProps {
    item: NavigationItem;
    level: number;
    isActive: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    expandedItems: Set<string>;
    setExpandedItems: (items: Set<string>) => void;
    isItemActive: (item: NavigationItem) => boolean;
}

function NavigationItemComponent({
    item,
    level,
    isActive,
    isExpanded,
    onToggle,
    expandedItems,
    setExpandedItems,
    isItemActive
}: NavigationItemProps) {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = level * 16 + 12;

    const handleChildToggle = (childUrl: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(childUrl)) {
            newExpanded.delete(childUrl);
        } else {
            newExpanded.add(childUrl);
        }
        setExpandedItems(newExpanded);
    };

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    isActive && "bg-accent text-accent-foreground font-medium"
                )}
                style={{ paddingLeft }}
                onClick={hasChildren ? onToggle : undefined}
            >
                {hasChildren && (
                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                        ) : (
                            <ChevronRight className="w-3 h-3" />
                        )}
                    </div>
                )}
                {!hasChildren && <div className="w-4" />}
                <Link
                    href={item.url}
                    className="flex-1 truncate"
                    onClick={(e) => {
                        if (hasChildren) {
                            e.preventDefault();
                        }
                    }}
                >
                    {item.title}
                </Link>
            </div>
            {hasChildren && isExpanded && (
                <div>
                    {item.children!.map((child) => (
                        <NavigationItemComponent
                            key={child.url}
                            item={child}
                            level={level + 1}
                            isActive={isItemActive(child)}
                            isExpanded={expandedItems.has(child.url)}
                            onToggle={() => handleChildToggle(child.url)}
                            expandedItems={expandedItems}
                            setExpandedItems={setExpandedItems}
                            isItemActive={isItemActive}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function LMSNavigation() {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpanded = (url: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(url)) {
            newExpanded.delete(url);
        } else {
            newExpanded.add(url);
        }
        setExpandedItems(newExpanded);
    };

    const isItemActive = (item: NavigationItem): boolean => {
        if (item.url === pathname) return true;
        if (item.children) {
            return item.children.some(child => isItemActive(child));
        }
        return false;
    };

    // Auto-expand navigation to show current active item
    const getParentUrls = useCallback((item: NavigationItem, targetUrl: string, parents: string[] = []): string[] | null => {
        if (item.url === targetUrl) {
            return parents;
        }
        if (item.children) {
            for (const child of item.children) {
                const result = getParentUrls(child, targetUrl, [...parents, item.url]);
                if (result) return result;
            }
        }
        return null;
    }, []);

    // Auto-expand when pathname changes
    React.useEffect(() => {
        const navigationGroups = buildLMSNavigation();

        for (const group of navigationGroups) {
            for (const item of group.items) {
                const parentUrls = getParentUrls(item, pathname);
                if (parentUrls) {
                    // Add the group to expanded items
                    const expandedSet = new Set(parentUrls);
                    expandedSet.add(`group-${group.title}`);
                    setExpandedItems(expandedSet);
                    return;
                }
            }
        }
    }, [pathname, getParentUrls]);

    // Preserve navigation state during route changes
    React.useEffect(() => {
        // Keep navigation expanded state persistent
        const savedState = sessionStorage.getItem('lms-navigation-state');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                setExpandedItems(new Set(parsedState));
            } catch (error) {
                console.warn('Failed to restore navigation state:', error);
            }
        }
    }, []);

    // Save navigation state
    React.useEffect(() => {
        if (expandedItems.size > 0) {
            sessionStorage.setItem('lms-navigation-state', JSON.stringify([...expandedItems]));
        }
    }, [expandedItems]);

    const navigationGroups = buildLMSNavigation();

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-3">
                <h2 className="text-lg font-semibold mb-4">Learning Content</h2>
                <div className="space-y-2">
                    {navigationGroups.map((group) => {
                        const isGroupExpanded = expandedItems.has(`group-${group.title}`);

                        return (
                            <div key={group.title} className="space-y-1">
                                <div
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                                    onClick={() => toggleExpanded(`group-${group.title}`)}
                                >
                                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                        {isGroupExpanded ? (
                                            <ChevronDown className="w-3 h-3" />
                                        ) : (
                                            <ChevronRight className="w-3 h-3" />
                                        )}
                                    </div>
                                    <group.icon className="w-4 h-4" />
                                    {group.title}
                                </div>
                                {isGroupExpanded && (
                                    <div className="space-y-1">
                                        {group.items.map((item) => (
                                            <NavigationItemComponent
                                                key={item.url}
                                                item={item}
                                                level={0}
                                                isActive={isItemActive(item)}
                                                isExpanded={expandedItems.has(item.url)}
                                                onToggle={() => toggleExpanded(item.url)}
                                                expandedItems={expandedItems}
                                                setExpandedItems={setExpandedItems}
                                                isItemActive={isItemActive}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
