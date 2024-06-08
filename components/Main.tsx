"use client";
import KakaoMap from "@/app/KakaoMap";
import { PlacesSearchResultItem } from "@type/searchType";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Address } from "react-daum-postcode";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import ListItem from "./ListItem";
import RoundBtn from "./common/RoundBtn";
import MainFooter from "./common/MainFooter";
import { KEYWORD_LIST, RADIUS_LIST } from "@Enum/ListEnum";
import Image from "next/image";
import localIcon from "@public/img/mylocation_Icon.png";

const KAKAO_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";

// const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false&libraries=services`;

export default function Main() {
    const ref = useRef<HTMLDivElement | null>(null);
    const [openPostcode, setOpenPostcode] = useState<boolean>(false);
    const [searchAdress, setSearchAdress] = useState<Address>();
    // const [inputValue, setInputValue] = useState("");
    const DaumPostcodeRef = useRef<HTMLDivElement | null>(null);
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
    const [state, setState] = useState({
        center: { lat: 0, lng: 0 },
        localcenter: { lat: 0, lng: 0 },
        errMsg: "",
        isLoading: true,
    });
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const [radius, setRadius] = useState({ id: 0, title: "", value: 0, emoji: "", level: 0 });
    const [keyWord, setKeyWord] = useState({ id: 0, title: "", value: "", emoji: "" });
    const [isOpen, setIsOpen] = useState(false);
    const [randomSelect, setRandomSelect] = useState<PlacesSearchResultItem | null>(null);
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

    // 카테고리 검색으로 주변 위치 검색하기
    const searchPlaces = (keyword: any, radius: any) => {
        if (!state.center) return;
        const ps = new kakao.maps.services.Places();
        const options = {
            location: new kakao.maps.LatLng(state.localcenter.lat, state.localcenter.lng),
            radius: radius,
            sort: kakao.maps.services.SortBy.DISTANCE,
        };
        ps.keywordSearch(
            keyword,
            (data, status, _pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    setSearch((pre) => ({ ...pre, errMsg: "", arr: data }));
                    // setSearchErr("");
                } else {
                    // setSearch([]);
                    // console.error("검색에 실패하였습니다.");
                    // setSearchErr("검색결과가 없습니다.");
                    setSearch((pre) => ({ ...pre, errMsg: "검색결과가 없습니다. 범위를 늘려보세요.", arr: [] }));
                }
                setRandomSelect(null);
            },
            options
        );
    };

    const selectSearchFn = (data: PlacesSearchResultItem) => {
        setIsOpen(true);
        setSearch((pre) => ({ ...pre, select: data }));
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
        const random = Math.floor(Math.random() * search.arr.length);
        setRandomSelect(search.arr[random]);
    };
    const RandomSelectNull = () => {
        setRandomSelect(null);
    };

    const changeSdkLoaded = useCallback((boolean: boolean) => {
        setIsSdkLoaded(boolean);
    }, []);

    useEffect(() => {
        if (isSdkLoaded) {
            getCurrentLocation();
            setKeyWord(KEYWORD_LIST[0]);
            setRadius(RADIUS_LIST[0]);
        }
    }, [isSdkLoaded]);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = `${window.innerHeight - ref.current?.getBoundingClientRect().top - 100}px`;
        }
    }, [search.arr.length]);

    useEffect(() => {
        if (!isSdkLoaded) return;
        const { kakao } = window;

        const geocoder = new kakao.maps.services.Geocoder();
        if (searchAdress?.address) {
            geocoder.addressSearch(searchAdress?.address, (result: any, status: any) => {
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
        }
    }, [searchAdress?.address]);
    useEffect(() => {
        console.log(keyWord.value);
        console.log(radius.value);
        console.log(isSdkLoaded && keyWord.value && radius.value);
        console.log(state);
        if (isSdkLoaded && keyWord.value && radius.value && !state.isLoading) {
            searchPlaces(keyWord.value, radius.value);
        }
    }, [keyWord.value, radius.value, isSdkLoaded, state.isLoading]);

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
        <div className="max-h-screen">
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
            <div className="w-[100vw] h-[300px] min-h-[300px] relative">
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
                    onClick={() => getCurrentLocation()}
                >
                    <Image
                        unoptimized={true}
                        src={"/img/mylocation_Icon.png"}
                        width={20}
                        height={20}
                        alt="현재위치아이콘"
                    />
                </button>
            </div>
            <div>
                <div className="border overflow-x-scroll whitespace-nowrap flex gap-[10px] p-2">
                    {KEYWORD_LIST.map((keywordObj) => (
                        <React.Fragment key={`KEYWORD_LIST ${keywordObj.id}`}>
                            <RoundBtn
                                style={
                                    keyWord && keywordObj.id === keyWord.id
                                        ? { color: "white", backgroundColor: "var(--red)", border: "none" }
                                        : undefined
                                }
                                type="button"
                                onClick={() => {
                                    RandomSelectNull();
                                    setKeyWord(keywordObj);
                                }}
                            >
                                {keywordObj.title}
                            </RoundBtn>
                        </React.Fragment>
                    ))}
                </div>
                {/* <button onClick={() => getCurrentLocation()}>현재위치</button> */}
            </div>
            <div className="overflow-y-scroll flex flex-col gap-[10px] mt-[10px]" ref={ref}>
                {randomSelect ? (
                    <ListItem data={randomSelect} selectSearchFn={selectSearchFn} />
                ) : (
                    search.arr.map((data, i) => {
                        return (
                            <React.Fragment key={data.id}>
                                <ListItem data={data} selectSearchFn={selectSearchFn} />
                            </React.Fragment>
                        );
                    })
                )}
                {search.errMsg}
            </div>
            <MainFooter
                getRandomRestaurant={getRandomRestaurant}
                search={search}
                radius={radius}
                setRadius={setRadius}
                RandomSelectNull={RandomSelectNull}
            />
            {/* {openPostcode && (
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
            )} */}
        </div>
    );
}
