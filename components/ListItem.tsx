"use client";
import { PlacesSearchResultItem } from "@type/searchType";
import React from "react";

interface props {
    data: PlacesSearchResultItem;
    selectSearchFn?: (data: PlacesSearchResultItem) => void;
}

const ListItem = ({ data, selectSearchFn }: props) => {
    return (
        <div
            className="border mx-[10px] flex flex-col gap-y-[5px] p-[10px] rounded-md"
            onClick={() => (selectSearchFn ? selectSearchFn(data) : null)}
        >
            <p className="font-bold">{data.place_name}</p>
            <p className="text-gray-500">{data.address_name}</p>
            <p>{data.category_group_name}</p>
        </div>
    );
};

export default ListItem;
