"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import DaumPostcode, { Address } from "react-daum-postcode";
import KakaoMap from "@/app/KakaoMap";

// const KAKAO_SEARCH_URL = /v2/acllo / search / address.json;
const KAKAO_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/address.json";

export default function Main() {
    const [openPostcode, setOpenPostcode] = useState<boolean>(false);
    const [searchAdress, setSearchAdress] = useState<Address>();
    const [inputValue, setInputValue] = useState("");
    const DaumPostcodeRef = useRef<HTMLDivElement | null>(null);
    const handle = useMemo(() => {
        // 버튼 클릭 이벤트
        const clickButton = () => setOpenPostcode((current) => !current);
        // 주소 선택 이벤트
        const selectAddress = (data: Address) => {
            setSearchAdress(data);
            setOpenPostcode(false);
        };

        return { clickButton, selectAddress };
    }, []);

    useEffect(() => {
        const clickOutside = (e: MouseEvent) => {
            if (openPostcode && DaumPostcodeRef.current && !DaumPostcodeRef.current.contains(e.target as Node)) {
                handle.clickButton();
            }
        };

        if (typeof document !== "undefined") {
            document.addEventListener("click", clickOutside);
        }

        // Cleanup function
        return () => {
            if (typeof document !== "undefined") {
                document.removeEventListener("click", clickOutside);
            }
        };
    }, [openPostcode, handle]);
    return (
        <div>
            <div className="relative">
                <button onClick={handle.clickButton}>검색창 열기</button>
                <input onChange={(e) => setInputValue(e.target.value)} value={inputValue} />
                <button
                    onClick={async () => {
                        let getData = await fetch(`${KAKAO_SEARCH_URL}?query=${inputValue}`, {
                            headers: { Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_APP_RESTAPI_KEY}` },
                        });
                        let result = await getData.json();
                        console.log(result);
                    }}
                >
                    전송하기
                </button>
            </div>
            <div className="w-[100vw] h-[300px]">
                <KakaoMap searchAdress={searchAdress?.address} />
            </div>
            {openPostcode && (
                <div ref={DaumPostcodeRef} onClick={handle.clickButton} className="flex justify-center items-center">
                    <DaumPostcode
                        onComplete={handle.selectAddress} // 값을 선택할 경우 실행되는 이벤트
                        autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                        defaultQuery="" // 팝업을 열때 기본적으로 입력되는 검색어
                        style={{
                            position: "absolute",
                            zIndex: "5",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "80%",
                        }}
                    />
                </div>
            )}
        </div>
    );
}
