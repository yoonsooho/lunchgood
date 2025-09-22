"use client";
import KakaoMap from "@/app/KakaoMap";
import { KEYWORD_LIST, RADIUS_LIST } from "@Enum/ListEnum";
import { PlacesSearchResultItem } from "@type/searchType";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Address } from "react-daum-postcode";
import ListItem from "./ListItem";
import MainFooter from "./common/MainFooter";
import RoundBtn from "./common/RoundBtn";
import { useInView } from "react-intersection-observer";
import useDidMountEffect from "../hooks/useDidMountEffect";
import myLocationImg from "@public/img/mylocation_Icon.png";
import { signIn } from "next-auth/react";
import LoginBtn from "./LoginBtn";

const KAKAO_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";

export default function Main() {
    const {
        ref: useInViewRef,
        inView,
        entry,
    } = useInView({
        /* Optional options */
        threshold: 0,
    });
    const divRef = useRef<HTMLDivElement | null>(null);
    const [search, setSearch] = useState<{
        pageNation: any;
        arr: kakao.maps.services.PlacesSearchResult;
        select: PlacesSearchResultItem;
        errMsg: string;
    }>({
        pageNation: null,
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
    const [state, setState] = useState({
        center: { lat: 0, lng: 0 },
        localcenter: { lat: 0, lng: 0 },
        errMsg: "",
        isLoading: true,
    });
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const [radius, setRadius] = useState({
        id: 0,
        title: "",
        value: 0,
        emoji: "",
        level: 0,
    });
    const [keyWord, setKeyWord] = useState({
        id: 0,
        title: "",
        value: "",
        emoji: "",
    });
    const [isOpen, setIsOpen] = useState(false);
    const [randomSelect, setRandomSelect] = useState<PlacesSearchResultItem | null>(null);
    const searchPlaces = (currentPage: number) => {
        if (!state.center) return;
        const ps = new kakao.maps.services.Places();
        const options = {
            location: new kakao.maps.LatLng(state.localcenter.lat, state.localcenter.lng),
            radius: radius.value,
            sort: kakao.maps.services.SortBy.DISTANCE,
            page: currentPage,
            size: 15,
        };
        ps.keywordSearch(
            keyWord.value,
            (data, status, _pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    setSearch((pre) => ({
                        ...pre,
                        errMsg: "",
                        arr: [...pre.arr, ...data],
                        pageNation: _pagination,
                    }));
                    // setSearchErr("");
                } else {
                    setSearch((pre) => ({
                        ...pre,
                        errMsg: "검색결과가 없습니다. 범위를 늘려보세요.",
                        arr: [],
                    }));
                }
                setRandomSelect(null);
            },
            options
        );
    };

    const selectSearchFn = (data: PlacesSearchResultItem) => {
        setIsOpen(true);
        setSearch((pre) => ({ ...pre, select: data }));
        setRadius((pre) => ({ ...pre, level: 1 }));
        setState((pre) => ({
            ...pre,
            center: { lat: Number(data.y), lng: Number(data.x) },
        }));
        // setSelectSearch(data);
    };

    //현재 위치 가져오는 함수
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setState((prev) => ({
                        ...prev,
                        localcenter: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                        isLoading: false,
                    }));
                },
                (err) => {
                    console.error(err);
                    setState((prev) => ({
                        ...prev,
                        errMsg: err.message,
                        isLoading: true,
                    }));
                },
                { maximumAge: 300000, timeout: 100000, enableHighAccuracy: true }
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
        const random = Math.floor(Math.random() * search.arr.length);
        setRandomSelect(search.arr[random]);
        setSearch((pre) => ({ ...pre, select: search.arr[random] }));
        setState((prev) => ({
            ...prev,
            center: {
                lat: Number(search.arr[random].y),
                lng: Number(search.arr[random].x),
            },
        }));
    };
    const RandomSelectNull = () => {
        setRandomSelect(null);
    };

    const changeSdkLoaded = useCallback((boolean: boolean) => {
        setIsSdkLoaded(boolean);
    }, []);

    const searchNullArr = () => {
        setSearch((pre) => {
            return { ...pre, arr: [] };
        });
    };

    useEffect(() => {
        if (isSdkLoaded) {
            getCurrentLocation();
            setKeyWord(KEYWORD_LIST[0]);
            setRadius(RADIUS_LIST[0]);
        }
    }, [isSdkLoaded]); //마운트시 초기 값 설정

    useEffect(() => {
        if (divRef.current) {
            divRef.current.style.height = `${
                window.innerHeight - divRef.current?.getBoundingClientRect().top - 148.4
            }px`;
        }
    }, [search.arr.length]); //배열 길이가 달라질경우 높이 리스트 박스 높이 재설정

    useEffect(() => {
        if (isSdkLoaded && keyWord.value && radius.value && !state.isLoading) {
            searchPlaces(1);
        }
    }, [keyWord.value, radius.value, isSdkLoaded, state.isLoading]); //키워드와 범위로 주변 식당 검색
    useDidMountEffect(() => {
        if (
            isSdkLoaded &&
            keyWord.value &&
            radius.value &&
            !state.isLoading &&
            inView &&
            search.pageNation.current !== search.pageNation.last
        ) {
            searchPlaces(search.pageNation.current + 1);
        }
    }, [inView]);

    return (
        <div className="max-h-screen">
            {/* <LoginBtn></LoginBtn> */}

            {/* <div className="relative">
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
            </div> */}
            <div className="w-[100%] h-[300px] min-h-[300px] relative">
                <KakaoMap
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    search={search}
                    state={state}
                    changeSdkLoaded={changeSdkLoaded}
                    isSdkLoaded={isSdkLoaded}
                    radius={radius}
                />
                <button
                    className="absolute bottom-[10px] right-[10px] z-10 bg-white p-[5px] rounded-full shadow-md"
                    onClick={() => {
                        getCurrentLocation();
                        searchNullArr();
                        searchPlaces(1);
                    }}
                >
                    <Image
                        placeholder="blur"
                        unoptimized={true}
                        src={myLocationImg}
                        width={20}
                        height={20}
                        alt="현재위치아이콘"
                    />
                </button>
            </div>
            <div>
                <div className="border overflow-x-scroll whitespace-nowrap flex gap-[10px] p-3">
                    {KEYWORD_LIST.map((keywordObj) => (
                        <React.Fragment key={`KEYWORD_LIST ${keywordObj.id}`}>
                            <RoundBtn
                                style={
                                    keyWord && keywordObj.id === keyWord.id
                                        ? {
                                              color: "white",
                                              backgroundColor: "var(--red)",
                                              border: "none",
                                          }
                                        : undefined
                                }
                                type="button"
                                onClick={() => {
                                    RandomSelectNull();
                                    if (keywordObj.id !== keyWord.id) {
                                        searchNullArr();
                                    }
                                    setKeyWord(keywordObj);
                                }}
                            >
                                {keywordObj.title}
                            </RoundBtn>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="overflow-y-scroll flex flex-col pb-[16px]" ref={divRef}>
                {randomSelect ? (
                    <ListItem data={randomSelect} selectSearchFn={selectSearchFn} selectId={search.select.id} />
                ) : (
                    search.arr.map((data, i) => {
                        return search.arr.length === i + 1 ? (
                            <React.Fragment key={data.id}>
                                <ListItem data={data} selectSearchFn={selectSearchFn} selectId={search.select.id} />
                                <div ref={useInViewRef}></div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment key={data.id}>
                                <ListItem data={data} selectSearchFn={selectSearchFn} selectId={search.select.id} />
                            </React.Fragment>
                        );
                    })
                )}
                {/* <div ref={useInViewRef}></div> */}
                {search.errMsg}
            </div>

            <MainFooter
                getRandomRestaurant={getRandomRestaurant}
                search={search}
                searchNullArr={searchNullArr}
                radius={radius}
                setRadius={setRadius}
                RandomSelectNull={RandomSelectNull}
            />
        </div>
    );
}
