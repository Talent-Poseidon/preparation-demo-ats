import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST handler for creating a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, assignees } = body;

    // Validate input
    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create new project
    const newProject = await prisma.project.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        assignees: {
          create: assignees.map((assignee: { email: string; name: string }) => ({
            email: assignee.email,
            name: assignee.name,
          })),
        },
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET handler for fetching projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        assignees: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
