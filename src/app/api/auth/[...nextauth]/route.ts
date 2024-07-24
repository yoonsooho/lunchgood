import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
// import NaverProvider from "next-auth/providers/naver";
// import GoogleProvider from "next-auth/providers/google";

const authOptions: any = {
    // secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: "secret",
    },

    // Configure one or more authentication providers
    providers: [
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID ?? "",
            clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
        }),
        // NaverProvider({
        //     clientId: process.env.KAKAO_CLIENT_ID ?? "",
        //     clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
        // }),
        // GoogleProvider({
        //     clientId: process.env.KAKAO_CLIENT_ID ?? "",
        //     clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
        // }), // ...add more providers here
    ],
    // session: {
    //     strategy: "jwt",
    //     maxAge: 60 * 24 * 60 * 60, //30일
    // },

    // callbacks: {
    //     async jwt({ token, user }: { token: any; user: any }) {
    //         // console.log("tokentokentokentoken", token);
    //         // console.log("useruseruseruseruser", user);
    //         return { ...token, ...user, test: "test" };
    //     },

    //     async session({ token, session }: { token: any; session: any }) {
    //         // console.log("useruseruseruseruser", token.user);
    //         // console.log("testtesttesttesttest", token.test);
    //         // console.log("tokentokentokentoken", token);
    //         // console.log("sessionsessionsession", session);
    //         session.user = token as any;
    //         return session;
    //     },
    // },
    // // 토큰이나 세션 활용하여 사용자 제어 시 사용하는 로직

    callbacks: {
        async jwt({ token, account, user }: { token: any; account: any; user: any }) {
            // Persist the OAuth access_token to the token right after signin
            // console.log("account", account);
            // console.log("user", user);
            // console.log("token", token);
            if (account && user) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = new Date().getTime() / 1000 + Math.round(account.expires_at / 1000); // 약 20일 현재는 초로 되어 있음
                token.refreshTokenExpires = new Date().getTime() / 1000 + account.refresh_token_expires_in; //약 60일 현재는 초로 되어 있음
                // console.log(Math.round(account.expires_at / 1000));
            } else {
                if (new Date().getTime() * 1000 - 60 * 60 * 24 > token.accessTokenExpires) {
                    let result = await fetch("https://kauth.kakao.com/oauth/token", {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                        },
                        method: "POST",
                        body: new URLSearchParams({
                            grant_type: "refresh_token",
                            client_id: process.env.KAKAO_CLIENT_ID ?? "",
                            client_secret: process.env.KAKAO_CLIENT_SECRET ?? "", // clientSecret을 client_secret로 수정
                            refresh_token: token.refreshToken,
                        }).toString(),
                    });
                    let parseResult = await result.json();
                    // console.log("parseResultparseResultparseResult", parseResult);
                    token.accessToken = parseResult.access_token;
                    token.accessTokenExpires = new Date().getTime() / 1000 + parseResult.expires_in; //대략 6시간
                    if (parseResult.refresh_token) {
                        token.refreshToken = parseResult.refresh_token;
                        token.refreshTokenExpires = new Date().getTime() / 1000 + parseResult.refresh_token_expires_in;
                    }
                }
            } //중간에 하다가 포기 2024.07.23 신경 쓸게 너무 많은데 테스트도 못해보고 흠
            return token;
        },
        async session({ session, token, user }: { session: any; token: any; user: any }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.refreshTokenExpires = token.refreshTokenExpires;
            return session;
        },
    }, //카카오 jwt방식으로 하기
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
