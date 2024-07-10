import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
// import NaverProvider from "next-auth/providers/naver";
// import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
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
    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
            console.log("tokentokentokentoken", token);
            console.log("useruseruseruseruser", user);
            return { ...token, ...user, test: "test" };
        },

        async session({ token, session }: { token: any; session: any }) {
            console.log("useruseruseruseruser", token.user);
            console.log("testtesttesttesttest", token.test);
            console.log("tokentokentokentoken", token);
            console.log("sessionsessionsession", session);
            session.user = token as any;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
