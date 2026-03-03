import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[API] GET /api/projects failed:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, startDate, endDate, assigneeEmail, assigneeName, userId } = body;

    // Validate required fields
    if (!projectName || !startDate || !endDate || !assigneeEmail || !assigneeName || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate date logic
    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json({ error: "Start date must be before end date" }, { status: 400 });
    }

    // Create new project
    const project = await prisma.project.create({
      data: {
        name: projectName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        assigneeEmail,
        assigneeName,
        userId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/projects failed:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
