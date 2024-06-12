"use client";

import ListItem from "@components/ListItem";
import Script from "next/script";
import React, { useCallback, useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapInfoWindow, MapMarker } from "react-kakao-maps-sdk";
import { PlacesSearchResultItem } from "@type/searchType";
import RoundBtn from "@components/common/RoundBtn";
import MainFooter from "@components/common/MainFooter";

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
                <>
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
                                        console.log(data);
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
                                        console.log(data);
                                    }}
                                />
                            )
                        )}
                        {search.select && isOpen && (
                            <CustomOverlayMap // 인포윈도우를 생성하고 지도에 표시합니다
                                position={{ lat: Number(search.select.y), lng: Number(search.select.x) }}
                            >
                                {/* 인포윈도우에 표출될 내용으로 HTML 문자열이나 React Component가 가능합니다 */}
                                <div className="bg-slate-50 mt-[97px] relative border">
                                    <p
                                        style={{
                                            color: "#000",
                                            zIndex: "100",
                                            width: "120px",
                                            height: "50px",
                                            // display: "inline-block",
                                            boxSizing: "border-box" /* 패딩과 경계선을 포함하도록 설정 */,
                                            // overflowWrap: "break-word",
                                            // wordBreak: "break-all",
                                            whiteSpace: "normal",
                                        }}
                                    >
                                        {search.select.place_name}
                                    </p>
                                    <button className="close" onClick={() => setIsOpen(false)}>
                                        닫기
                                    </button>
                                </div>
                            </CustomOverlayMap>
                        )}
                    </Map>
                </>
            ) : (
                <div>로딩중....</div>
            )}
        </>
    );
};

export default KakaoMap;
