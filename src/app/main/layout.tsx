import MainFooter from "@components/common/MainFooter";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "뭐먹지?",
    description: "뭐먹지 메인페이지",
};

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="relative h-screen box-border flex flex-col">{children}</div>;
}
