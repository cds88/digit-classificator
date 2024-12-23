import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {

    try {
        const body = await req.json();
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/predict`,body)

        console.log("response is ", response.data )

        return NextResponse.json({test:123})
    } catch (error) {
        console.log("error is ", error)
        return NextResponse.json({error:"An unexpected error occured"},{status: 500})
    }
  
  }