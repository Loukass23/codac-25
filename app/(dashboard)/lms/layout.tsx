import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Learning Management System",
    description: "Access your courses and learning materials",
};

export default function LMSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    );
}
