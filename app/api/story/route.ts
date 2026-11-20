import { NextResponse } from "next/server";





const url = "https://shortstories-api.onrender.com/";

export async function GET(){

    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Google API returned status ${response.status}`);
        };  
        const story = await response.json();
        return NextResponse.json({story}, {status: 200});
    } catch {
        return NextResponse.json({message: 'Something went wrong with story!!!'}, {status: 400});
    }

};