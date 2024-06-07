"use client";
import { PlacesSearchResultItem } from "@type/searchType";
import React from "react";

interface props {
    data: PlacesSearchResultItem;
    selectSearchFn?: (data: PlacesSearchResultItem) => void;
}

const ListItem = ({ data, selectSearchFn }: props) => {
    return (
        <div className="border-[1px] border-black" onClick={() => (selectSearchFn ? selectSearchFn(data) : null)}>
            <p>{data.place_name}</p>
            <p>{data.address_name}</p>
            <p>{data.category_group_name}</p>
        </div>
    );
};

export default ListItem;
