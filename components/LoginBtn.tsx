"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const LoginBtn = () => {
    const { data } = useSession();
    console.log(data);

    const onClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (data) {
            await signOut();
        } else {
            await signIn("kakao");
        }
    };
    console.log(data);
    return (
        <div>
            {/* {data?.user && (
                <Avatar>
                                    
                    <AvatarImage src={data.user.image ?? ""} alt="user image" />
                                    <AvatarFallback>CN</AvatarFallback>
                                
                </Avatar>
            )} */}
            {data?.user && <p>{data?.user?.name}님 반갑습니다.</p>}
            <button onClick={onClick} className="text-sm">
                {data ? "로그아웃" : "카카오 아이디로 로그인"}
            </button>
        </div>
    );
};

export default LoginBtn;
