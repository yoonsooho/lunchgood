"use client";

import ListItem from "@components/ListItem";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { PlacesSearchResultItem } from "@type/searchType";

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false&libraries=services`;

const KEYWORD_LIST = [
    { id: 1, value: "애견카페", emoji: "☕️" },
    { id: 2, value: "병원", emoji: "🧑‍⚕️" },
    { id: 3, value: "애견호텔", emoji: "🏨" },
    { id: 4, value: "음식점", emoji: "🏨" },
];

const KakaoMap = ({ searchAdress }: any) => {
    const [search, setSearch] = useState<kakao.maps.services.PlacesSearchResult>([]);
    const [state, setState] = useState({
        center: { lat: 0, lng: 0 },
        errMsg: "",
        isLoading: true,
    });
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);

    // 카테고리 검색으로 주변 위치 검색하기
    const searchPlaces = (keyword: any) => {
        if (!state.center) return;
        const ps = new kakao.maps.services.Places();
        const options = {
            location: new kakao.maps.LatLng(state.center.lat, state.center.lng),
            radius: 1000,
            sort: kakao.maps.services.SortBy.DISTANCE,
        };

        ps.keywordSearch(
            keyword,
            (data, status, _pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    setSearch(data);
                } else {
                    setSearch([]);
                    console.error("검색에 실패하였습니다.");
                }
            },
            options
        );
    };
    //현재 위치 가져오는 함수
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position);
                    setState((prev) => ({
                        ...prev,
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                        isLoading: false,
                    }));
                },
                (err) => {
                    setState((prev) => ({
                        ...prev,
                        errMsg: err.message,
                        isLoading: true,
                    }));
                }
            );
        } else {
            setState((prev) => ({
                ...prev,
                errMsg: "geolocation을 사용할수 없어요..",
                isLoading: true,
            }));
        }
    };
    // 현재 사용자 위치 받아오기 (geolocation)
    useEffect(() => {
        getCurrentLocation();
        setState((prev) => ({
            ...prev,
            isLoading: true,
        }));
    }, []);

    useEffect(() => {
        if (!isSdkLoaded) {
            console.error("Kakao Maps SDK가 로드되지 않았습니다.");
            return;
        }
        const { kakao } = window;

        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(searchAdress, (result: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].road_address.y, result[0].road_address.x);
                setState((prev) => ({
                    ...prev,
                    center: {
                        lat: result[0].road_address.y,
                        lng: result[0].road_address.x,
                    },
                    isLoading: false,
                }));

                // // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                // map.setCenter(coords);

                // // 마커를 결과값으로 받은 위치로 옮깁니다
                // marker.setPosition(coords);
            }
        });
    }, [searchAdress]);

    return (
        <>
            <Script
                type="text/javascript"
                src={KAKAO_SDK_URL}
                onLoad={() => {
                    console.log("Kakao Maps SDK loaded"), window.kakao.maps.load(() => setIsSdkLoaded(true));
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
                        marginTop: "48px",
                    }}
                    level={3}
                >
                    <MapMarker
                        position={state.center}
                        image={{
                            src: "https://cdn-icons-png.flaticon.com/128/7124/7124723.png",
                            size: { width: 50, height: 50 },
                        }}
                    />
                    {search.map((data: PlacesSearchResultItem, i) => (
                        <MapMarker
                            key={`MapMaker-${i}`}
                            position={{ lat: Number(data.y), lng: Number(data.x) }}
                            image={{
                                src: "https://cdn-icons-png.flaticon.com/128/2098/2098567.png",
                                size: { width: 35, height: 35 },
                            }}
                            onClick={() => {
                                console.log(data);
                            }}
                        />
                    ))}
                    <div>
                        {KEYWORD_LIST.map((keywordObj) => (
                            <button key={keywordObj.id} type="button" onClick={() => searchPlaces(keywordObj.value)}>
                                {keywordObj.value + keywordObj.emoji}
                            </button>
                        ))}
                        <button onClick={() => getCurrentLocation()}>현재위치</button>
                    </div>
                </Map>
            ) : (
                <div>로딩중....</div>
            )}
            {search.map((data, i) => {
                console.log(data);
                return (
                    <React.Fragment key={data.id}>
                        <ListItem data={data} />
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default KakaoMap;
