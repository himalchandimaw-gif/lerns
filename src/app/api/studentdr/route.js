import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma' // adjust path if needed

export async function GET() {
  try {
    const students = await prisma.student.findMany()
    console.log(students)
    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Error fetching students' }, { status: 500 })
  }
}
