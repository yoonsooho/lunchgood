import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
    // 로그인 했을 경우에만 존재함 ( "next-auth.session-token" 쿠키가 존재할 때 )
    const session = await getToken({ req, raw: true, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;
    console.log("session", session);

    // 2022/08/13 - 로그인/회원가입 접근 제한 - by 1-blue
    if (pathname.startsWith("/main")) {
        if (session) {
            // return NextResponse.redirect(new URL("/", req.url));
            console.log("미들웨어 동작");
        }
    }
}

export const config = {
    matcher: ["/main"],
};
