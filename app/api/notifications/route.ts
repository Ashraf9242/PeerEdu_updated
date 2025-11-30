
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";

import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsedPage = parseInt(searchParams.get("page") || "1", 10);
    const parsedLimit = parseInt(searchParams.get("limit") || "10", 10);
    const read = searchParams.get("read");

    const page = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
    const limit = Number.isNaN(parsedLimit) ? 10 : Math.min(50, Math.max(1, parsedLimit));
    const skip = (page - 1) * limit;

    const whereClause: Prisma.NotificationWhereInput = {
        userId: session.user.id,
    };

    if (read === "true") {
        whereClause.read = true;
    } else if (read === "false") {
        whereClause.read = false;
    }

    try {
        const notifications = await db.notification.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        });

        const totalNotifications = await db.notification.count({ where: whereClause });

        const unreadCount = await db.notification.count({
            where: { userId: session.user.id, read: false },
        });

        return NextResponse.json({
            notifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: page,
            unreadCount,
        });
    } catch (error) {
        console.error("[GET_NOTIFICATIONS]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
