import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      fullName: true,
      fatherName: true,
      educationalQualification: true,
      profession: true,
      village: true,
      union: true,
      upazila: true,
      district: true,
      electionSeatNo: true,
      phoneNumber: true,
      favoriteParty: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const data = await req.json();
    
    // Only allow updating editable fields
    const updateData = {
      fullName: data.fullName,
      fatherName: data.fatherName,
      educationalQualification: data.educationalQualification,
      profession: data.profession,
      village: data.village,
      union: data.union,
      upazila: data.upazila,
      district: data.district,
      electionSeatNo: data.electionSeatNo,
      phoneNumber: data.phoneNumber,
      favoriteParty: data.favoriteParty,
    };
    
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        fatherName: true,
        educationalQualification: true,
        profession: true,
        village: true,
        union: true,
        upazila: true,
        district: true,
        electionSeatNo: true,
        phoneNumber: true,
        favoriteParty: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
