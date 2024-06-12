"use client";
import { PlacesSearchResultItem } from "@type/searchType";
import Image from "next/image";
import React from "react";

interface props {
  data: PlacesSearchResultItem;
  selectSearchFn?: (data: PlacesSearchResultItem) => void;
  selectId?: string;
}

const ListItem = ({ data, selectSearchFn, selectId }: props) => {
  return (
    <div
      className={`border mx-[10px] flex flex-row py-[16px] px-[20px] rounded-md mt-4 ${
        selectId === data.id ? "border-[var(--red)]" : ""
      }`}
      onClick={() => (selectSearchFn ? selectSearchFn(data) : null)}
    >
      <div className="flex-[0.8] flex flex-col gap-y-[10px]">
        <span>
          <a
            className={`font-black tracking-wide${
              selectId === data.id ? "text-[var(--red)]" : null
            }`}
            href={data.place_url}
            target="_blank"
          >
            {data.place_name}
            {" 〉"}
          </a>
        </span>
        <p className="text-gray-500 text-sm">{data.address_name}</p>
        <p className="text-sm">{data.category_name}</p>
      </div>
      <div className="flex-[0.2] flex items-center justify-center">
        <a href={`https://map.kakao.com/link/to/${data.id}`} target="_blank">
          <Image
            unoptimized={true}
            src={"/img/findLoadIcon.png"}
            width={40}
            height={40}
            alt="현재위치아이콘"
          />
        </a>
      </div>
    </div>
  );
};

export default ListItem;
