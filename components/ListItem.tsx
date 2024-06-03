"use client";
import { PlacesSearchResultItem } from "@type/searchType";
import React from "react";

interface props {
    data: PlacesSearchResultItem;
}

const ListItem = ({ data }: props) => {
    console.log(data);
    return (
        <div className="border-[1px] border-black">
            <p>{data.address_name}</p>
            <p>{data.category_group_name}</p>
        </div>
    );
};

export default ListItem;
