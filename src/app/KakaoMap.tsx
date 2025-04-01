"use client";

import { PlacesSearchResultItem } from "@type/searchType";
import Script from "next/script";
import { Suspense } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false&libraries=services`;

const KakaoMap = ({ changeSdkLoaded, isSdkLoaded, state, search, isOpen, setIsOpen, radius }: any) => {
    return (
        <>
            <Script
                type="text/javascript"
                src={KAKAO_SDK_URL}
                onLoad={() => {
                    console.log("Kakao Maps SDK loaded"), window.kakao.maps.load(() => changeSdkLoaded(true));
                }}
                onError={(e) => {
                    console.error("Failed to load Kakao Maps SDK", e);
                }}
            />
            {isSdkLoaded && !state.isLoading ? (
                <Map
                    center={state.center}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    level={radius.level}
                >
                    <MapMarker
                        position={state.localcenter}
                        image={{
                            src: "https://cdn-icons-png.flaticon.com/128/7124/7124723.png",
                            size: { width: 50, height: 50 },
                        }}
                    />
                    {search.arr.map((data: PlacesSearchResultItem, i: number) =>
                        search.select.id === data.id ? (
                            <MapMarker
                                zIndex={100}
                                key={`MapMaker-${i}`}
                                position={{ lat: Number(data.y), lng: Number(data.x) }}
                                image={{
                                    src: "/img/LocationIcon.svg",
                                    size: { width: 35, height: 35 },
                                }}
                                onClick={() => {
                                    // console.log(data);
                                }}
                            />
                        ) : (
                            <MapMarker
                                zIndex={99}
                                key={`MapMaker-${i}`}
                                position={{ lat: Number(data.y), lng: Number(data.x) }}
                                image={{
                                    src: "/img/maps-and-flags.svg",
                                    size: { width: 35, height: 35 },
                                }}
                                onClick={() => {
                                    // console.log(data);
                                }}
                            />
                        )
                    )}
                    {search.select && isOpen && (
                        <CustomOverlayMap // 인포윈도우를 생성하고 지도에 표시합니다
                            position={{ lat: Number(search.select.y), lng: Number(search.select.x) }}
                        >
                            {/* 인포윈도우에 표출될 내용으로 HTML 문자열이나 React Component가 가능합니다 */}
                            <div className="bg-white mt-[80px] relative border rounded-lg shadow-md p-3 min-w-[200px]">
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l"></div>
                                <p className="text-gray-800 font-medium mb-2 text-center overflow-hidden">
                                    {search.select.place_name}
                                </p>
                                <div className="flex justify-end mt-2">
                                    <button
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        닫기
                                    </button>
                                </div>
                            </div>
                        </CustomOverlayMap>
                    )}
                </Map>
            ) : (
                <div>로딩중....</div>
            )}
        </>
    );
};

export default KakaoMap;
