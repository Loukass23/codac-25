import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";

export default async function LMSPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    // Redirect to the welcome page
    redirect("/lms/welcome");
}
