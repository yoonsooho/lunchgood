import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: any;
}

const RoundBtn = ({ children, ...rest }: Props) => {
    return (
        <button {...rest} className="border px-4 py-[2px] rounded-l-full rounded-r-full text-sm">
            {children}
        </button>
    );
};

export default RoundBtn;
