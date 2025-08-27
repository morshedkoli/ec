import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      email,
      password,
      fullName,
      fatherName,
      educationalQualification,
      profession,
      village,
      union,
      upazila,
      district,
      electionSeatNo,
      phoneNumber,
      favoriteParty,
      facebookId,
    } = data;

    if (!email || !password || !fullName || !fatherName || !educationalQualification || !profession || !village || !union || !upazila || !district || !electionSeatNo || !phoneNumber || !favoriteParty) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        fullName,
        fatherName,
        educationalQualification,
        profession,
        village,
        union,
        upazila,
        district,
        electionSeatNo,
        phoneNumber,
        favoriteParty,
        facebookId: facebookId || null,
        role: "user",
      },
    });
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.fullName, role: user.role } });
  } catch (err) {
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
