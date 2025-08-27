import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { hash } from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: { not: "admin" },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        phoneNumber: true,
        village: true,
        union: true,
        upazila: true,
        district: true,
        educationalQualification: true,
        profession: true,
        electionSeatNo: true,
        favoriteParty: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.email || !body.password || !body.fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        fullName: body.fullName,
        fatherName: body.fatherName || "",
        educationalQualification: body.educationalQualification || "",
        profession: body.profession || "",
        village: body.village || "",
        union: body.union || "",
        upazila: body.upazila || "",
        district: body.district || "",
        electionSeatNo: body.electionSeatNo || "",
        phoneNumber: body.phoneNumber || "",
        favoriteParty: body.favoriteParty || "",
        role: body.role || "user",
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
