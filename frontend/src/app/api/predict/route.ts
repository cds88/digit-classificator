import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/predict/`;

    const response = await axios.post(URL, body);

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("error is ", error);
    return NextResponse.json(
      { error: "An unexpected error occured" },
      { status: 500 }
    );
  }
}
