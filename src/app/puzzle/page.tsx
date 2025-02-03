import {use} from "react";
import Image from "next/image";
import {linkStyle} from "@/app/navigation";

type ImageData = {
    id: string,
    author: string
    download_url: string
}

export default function Page() {
    const puzzlePageStyle = "flex flex-col gap-4 justify-center content-center text-center w-full p-4";
    const navbarStyle = "flex flex-row justify-center items-center w-full";
    const data: Promise<ImageData> =
        fetch(`https://picsum.photos/seed/1/info`)
            .then((res) => res.json());
    const imageData: ImageData = use(data);
    return (
        <div className={puzzlePageStyle}>
            <span className={navbarStyle}>
                <a className={"mr-auto " + linkStyle} href={'/'}>home</a>
            </span>
            <div className={"bg-no-repeat bg-center bg-contain w-auto h-[70vh]"}
                 style={{backgroundImage: `url(${imageData?.download_url})`}}>

            </div>
        </div>
    );
}
