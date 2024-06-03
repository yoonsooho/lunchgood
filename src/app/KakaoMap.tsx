"use client";

import ListItem from "@components/ListItem";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapInfoWindow, MapMarker } from "react-kakao-maps-sdk";
import { PlacesSearchResultItem } from "@type/searchType";

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false&libraries=services`;

const KEYWORD_LIST = [
    { id: 1, title: "한식", value: "한식", emoji: "☕️" },
    { id: 2, title: "중식", value: "중식", emoji: "🧑‍⚕️" },
    { id: 3, title: "양식", value: "양식", emoji: "🏨" },
    { id: 4, title: "전체", value: "음식점", emoji: "🏨" },
    { id: 5, title: "떡", value: "떡", emoji: "🏨" },
    { id: 6, title: "카페", value: "카페", emoji: "🏨" },
];
const RADIUS_LIST = [
    { id: 1, title: "100", value: 100, emoji: "☕️" },
    { id: 2, title: "250", value: 250, emoji: "🧑‍⚕️" },
    { id: 3, title: "500", value: 500, emoji: "🏨" },
    { id: 4, title: "1000", value: 800, emoji: "🏨" },
];

const KakaoMap = ({ searchAdress }: any) => {
    const [search, setSearch] = useState<{
        arr: kakao.maps.services.PlacesSearchResult;
        select: PlacesSearchResultItem;
        errMsg: string;
    }>({
        arr: [],
        select: {
            id: "",
            place_name: "",
            category_name: "",
            category_group_name: "",
            phone: "",
            address_name: "",
            road_address_name: "",
            x: "",
            y: "",
            place_url: "",
            distance: "",
        },
        errMsg: "",
    });
    // const [selectSearch, setSelectSearch] = useState<>();
    const [state, setState] = useState({
        center: { lat: 0, lng: 0 },
        errMsg: "",
        isLoading: true,
    });
    // const [searchErr, setSearchErr] = useState("");
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const [radius, setRadius] = useState(RADIUS_LIST[0]);
    const [keyWord, setKeyWord] = useState(KEYWORD_LIST[0]);
    const [isOpen, setIsOpen] = useState(false);

    // 카테고리 검색으로 주변 위치 검색하기
    const searchPlaces = (keyword: any, radius: any) => {
        if (!state.center) return;
        const ps = new kakao.maps.services.Places();
        const options = {
            location: new kakao.maps.LatLng(state.center.lat, state.center.lng),
            radius: radius,
            sort: kakao.maps.services.SortBy.DISTANCE,
        };

        ps.keywordSearch(
            keyword,
            (data, status, _pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    setSearch((pre) => {
                        const newPre = { ...pre };
                        return { ...newPre, errMsg: "", arr: data };
                    });
                    // setSearchErr("");
                } else {
                    // setSearch([]);
                    // console.error("검색에 실패하였습니다.");
                    // setSearchErr("검색결과가 없습니다.");
                    setSearch((pre) => {
                        const newPre = { ...pre };
                        return { ...newPre, errMsg: "검색결과가 없습니다.", arr: [] };
                    });
                }
            },
            options
        );
    };

    const selectSearchFn = (data: PlacesSearchResultItem) => {
        setIsOpen(true);
        setSearch((pre) => {
            const newPre = { ...pre };
            return { ...newPre, select: data };
        });
        // setSelectSearch(data);
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
    const getRandomRestaurant = () => {
        setSearch((pre) => {
            const newPre = { ...pre };
            const random = Math.floor(Math.random() * newPre.arr.length);
            // return [newPre[random]];
            return { ...newPre, arr: [newPre.arr[random]], select: newPre.arr[random] };
        });
    };

    useEffect(() => {
        getCurrentLocation();
        setState((prev) => ({
            ...prev,
            isLoading: true,
        }));
    }, []);

    useEffect(() => {
        if (!isSdkLoaded) return;
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
    useEffect(() => {
        if (!isSdkLoaded) return;
        if (keyWord.value && radius.value) {
            searchPlaces(keyWord.value, radius.value);
        }
    }, [keyWord.value, radius.value]);
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
                    {search.arr.map((data: PlacesSearchResultItem, i) => (
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
                    {search.select && isOpen && (
                        <CustomOverlayMap // 인포윈도우를 생성하고 지도에 표시합니다
                            position={{ lat: Number(search.select.y), lng: Number(search.select.x) }}
                        >
                            {/* 인포윈도우에 표출될 내용으로 HTML 문자열이나 React Component가 가능합니다 */}
                            <div className="bg-slate-50">
                                <div
                                    style={{
                                        color: "#000",
                                        zIndex: "100",
                                        width: "150px",
                                        height: "50px",
                                        display: "inline-block",
                                        boxSizing: "border-box" /* 패딩과 경계선을 포함하도록 설정 */,
                                    }}
                                >
                                    {search.select.place_name}
                                </div>
                                <button className="close" onClick={() => setIsOpen(false)}>
                                    닫기
                                </button>
                            </div>
                        </CustomOverlayMap>
                    )}
                    <div>
                        {KEYWORD_LIST.map((keywordObj) => (
                            <button key={keywordObj.id} type="button" onClick={() => setKeyWord(keywordObj)}>
                                {keywordObj.title + keywordObj.emoji}
                            </button>
                        ))}
                        <button onClick={() => getCurrentLocation()}>현재위치</button>
                        <div>
                            <button disabled={search.arr.length === 0} onClick={() => getRandomRestaurant()}>
                                뭘먹을까?
                            </button>
                        </div>
                        <div>
                            <p>거리선택</p>
                            {RADIUS_LIST.map((el) => {
                                return (
                                    <React.Fragment key={`RADIUS_LIST${el.id}`}>
                                        <button
                                            className={`${el.value === radius.value && "bg-red-50"}`}
                                            onClick={() => {
                                                setRadius(el);
                                            }}
                                        >
                                            {el.title}
                                        </button>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </Map>
            ) : (
                <div>로딩중....</div>
            )}
            {search.arr.map((data, i) => {
                return (
                    <React.Fragment key={data.id}>
                        <ListItem data={data} selectSearchFn={selectSearchFn} />
                    </React.Fragment>
                );
            })}
            {search.errMsg}
        </>
    );
};

export default KakaoMap;
