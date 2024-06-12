import MainFooter from "@components/common/MainFooter";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "뭐먹지?",
    description: "뭘먹으면 좋을지 추천해주는 사이트입니다.",
    openGraph: {
        images: "/img/openGraphImg.png",
    },
};

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="relative h-screen box-border flex flex-col">{children}</div>;
}
