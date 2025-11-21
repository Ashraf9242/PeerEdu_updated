
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.ts";
import { db } from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const count = await db.notification.count({
            where: {
                userId: session.user.id,
                read: false,
            },
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error("[GET_UNREAD_NOTIFICATIONS_COUNT]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
