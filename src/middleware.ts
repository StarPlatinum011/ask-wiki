import { NextRequest, NextResponse } from "next/server";


export function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const cookie = req.cookies.get("sessionId");

    //If no cookie, create one 
    if(!cookie) {
        res.cookies.set("sessionId", crypto.randomUUID());
    }

    return res;
}