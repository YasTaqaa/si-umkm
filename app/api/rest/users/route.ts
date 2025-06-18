//  app/api/rest/users/route.ts
import { NextRequest, NextResponse } from "next/server"


const userDummy = [
    { id: '1', name: 'Budi', role: 'umkm' },
    { id: '2', name: 'Admin', role: 'admin' },
  ]
  
  export async function GET() {
    return NextResponse.json(userDummy)
  }
  
  export async function POST(req: NextRequest) {
    const body = await req.json()
    const newUser = { ...body, id: Date.now().toString() }
    userDummy.push(newUser)
    return NextResponse.json(newUser, { status: 201 })
  }
  