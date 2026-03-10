import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendWhatsapp } from "../../../../lib/whatsappServer";

// Create new student
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, age, email, nic, tp, status, package: studentPackage } = body;

    // Create student with package
    const student = await prisma.student.create({
      data: {
        name,
        age: Number(age),
        email,
        nic,
        tp,
        status,
        package: studentPackage || null, // save package if provided
      },
    });

    // Send WhatsApp confirmation
    const message = `✅ Hello ${student.name}, 
You have been successfully registered! 🎉

NIC: ${student.nic}
Package: ${student.package || "Not selected"}
Date: ${new Date(student.registrationDate).toLocaleDateString()}`;

    try {
      await sendWhatsapp(student.tp, message);
      console.log("📩 WhatsApp message sent to", student.tp);
    } catch (err) {
      console.error("⚠️ WhatsApp message failed:", err);
    }

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("nic")) {
      return NextResponse.json(
        { error: "Student already registered with this NIC" },
        { status: 400 }
      );
    }

    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Student creation failed" },
      { status: 500 }
    );
  }
}

// Check if student exists by NIC
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nic = searchParams.get("nic");

    if (!nic) {
      return NextResponse.json(
        { error: "NIC query parameter required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { nic },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}
