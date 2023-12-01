import { auth } from "@clerk/nextjs" 
import { NextResponse } from "next/server";
import OpenAI from "openai"



const openai = new OpenAI({
    apiKey: process.env.OPENA_PI_KEY
});

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;
        
        if (!userId) {
            return new NextResponse("unauthorized", {status: 401});
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI Api Key not configured", {status: 500});
        }

        if (!messages) {
            return new NextResponse("Messages are required", {status: 400});
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        });
        console.log("#############################");
        console.log(messages);
        console.log("#############################");

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(response);
        console.log("#############################");
        return NextResponse.json(response.choices[0].message)

        
    }catch (error) {
        console.log("[CONVERSATION_ERROR]",error);
        return new NextResponse("internal Error",{status : 500});
    }
}