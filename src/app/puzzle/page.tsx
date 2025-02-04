import {linkStyle} from "@/app/navigation";
import Puzzle from "@/components/puzzle";
import React from "react";

export default async function Page() {
    const puzzlePageStyle =
        "flex flex-col gap-4 justify-center " +
        "items-center text-center w-full p-4 h-full";
    const response = await fetch('https://picsum.photos/id/1015/2000/2000', {
        next: {revalidate: 10},
    });

    const imageUrl = response.url;

    return (
        <div className={puzzlePageStyle}>
            <a className={linkStyle + " w-1/5 min-w-20 max-w-32"} href={'/'}>home</a>
            <Puzzle imageUrl={imageUrl} />
        </div>
    );
}
