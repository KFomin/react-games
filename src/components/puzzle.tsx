'use client';

import React, {useEffect, useRef, useState} from 'react';

interface ImagePiecesProps {
    imageUrl: string;
}

export default function Puzzle({imageUrl}: ImagePiecesProps) {
    const [imagePieces, setImagePieces] = useState<string[]>([]);
    const numColsToCut = 4;
    const numRowsToCut = 4;
    const widthOfOnePiece = 1920 / 4;
    const heightOfOnePiece = 1080 / 4;
    const gridRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = imageUrl;

        image.onload = () => {
            cutImageUp(image);
        };

        image.onerror = () => {
            console.error('Error loading image');
        };
    }, [imageUrl]);

    const cutImageUp = (image: HTMLImageElement) => {
        const pieces: string[] = [];
        for (let x = 0; x < numColsToCut; ++x) {
            for (let y = 0; y < numRowsToCut; ++y) {
                const canvas = document.createElement('canvas');
                canvas.width = widthOfOnePiece;
                canvas.height = heightOfOnePiece;
                const context = canvas.getContext('2d');
                if (context) {
                    context.drawImage(
                        image,
                        x * widthOfOnePiece,
                        y * heightOfOnePiece,
                        widthOfOnePiece,
                        heightOfOnePiece,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    pieces.push(canvas.toDataURL());
                }
            }
        }
        setImagePieces(pieces);
    };
    let cellWidth: number = 0;

    const calculateCellWidth = () => {
        if (gridRef.current) {
            cellWidth = gridRef.current.clientWidth / numColsToCut;
        }
    };

    calculateCellWidth();

    return (
        <>
            <div className="grid grid-flow-col grid-rows-4 bg-gray-800 max-w-[1080px]" ref={gridRef}>
                {Array.from({length: numColsToCut * numRowsToCut}).map((_, index) => (
                    <canvas
                        key={index}
                        width={widthOfOnePiece}
                        height={heightOfOnePiece}
                        className="w-full h-auto bg-gray-600 hover:bg-gray-500 border"
                    />
                ))}
            </div>
            <div className="grid grid-flow-col grid-rows-1 gap-1 max-w-full overflow-y-scroll">
                {imagePieces.map((piece, index) => (
                    <img
                        key={index}
                        src={piece}
                        alt={`Piece ${index}`}
                        width={cellWidth}
                        style={{minWidth: cellWidth + "px"}}
                        className="h-auto min-w-36"
                    />
                ))}
            </div>
        </>
    );
};
