import prisma from "../../../../lib/prisma";

export async function GET() {
  const students = await prisma.student.findMany({
    where: { status: true },
  });
  return new Response(JSON.stringify(students));
}
