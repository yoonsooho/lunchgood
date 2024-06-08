import { PlacesSearchResultItem } from "@type/searchType";
import React from "react";
import { RADIUS_LIST } from "@Enum/ListEnum";
import RoundBtn from "./RoundBtn";

interface props {
    getRandomRestaurant: () => void;
    search: { arr: kakao.maps.services.PlacesSearchResult; select: PlacesSearchResultItem; errMsg: string };
    radius: { id: number; title: string; value: number; emoji: string; level: number };
    setRadius: React.Dispatch<
        React.SetStateAction<{ id: number; title: string; value: number; emoji: string; level: number }>
    >;
    RandomSelectNull: () => void;
}
const MainFooter = ({ getRandomRestaurant, search, radius, setRadius, RandomSelectNull }: props) => {
    return (
        <div className="h-[100px] flex flex-col items-center justify-around border-t">
            <p>거리선택(m)</p>
            <div className="flex w-full justify-around">
                {RADIUS_LIST.map((el) => {
                    return (
                        <React.Fragment key={`RADIUS_LIST${el.id}`}>
                            <RoundBtn
                                style={
                                    radius && el.id === radius.id
                                        ? { color: "white", backgroundColor: "var(--red)", border: "none" }
                                        : undefined
                                }
                                className={`${el.value === radius.value && "bg-red-50"}`}
                                onClick={() => {
                                    RandomSelectNull();
                                    setRadius(el);
                                }}
                            >
                                {el.title}
                            </RoundBtn>
                        </React.Fragment>
                    );
                })}
            </div>
            <button
                className="border w-[98%] py-1 text-white bg-[var(--red)] rounded-md"
                disabled={search.arr.length === 0}
                onClick={() => {
                    getRandomRestaurant();
                }}
            >
                뭘먹을까?
            </button>
        </div>
    );
};

export default MainFooter;
