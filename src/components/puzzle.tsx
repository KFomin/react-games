'use client';

import React, {useEffect, useRef, useState} from 'react';

interface ImagePiecesProps {
    imageUrl: string;
}

interface ImagePiece {
    orderNo: number;
    url: string;
}

export default function Puzzle({imageUrl}: ImagePiecesProps) {
    const numColsToCut = 4;
    const numRowsToCut = 4;
    const widthOfOnePiece = 1920 / 4;
    const heightOfOnePiece = 1080 / 4;
    const emptyGridRef = useRef<HTMLDivElement | null>(null);
    const gridRef = useRef<HTMLDivElement | null>(null);

    const [imagePieces, setImagePieces] = useState<ImagePiece[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const [draggedImageWithIndex, setDraggedImage] = useState<[number, ImagePiece] | null>(null);
    const [targetPieceIndex, setTargetPieceIndex] = useState<number | null>(null);


    const handleMouseDown = (event: React.MouseEvent<HTMLImageElement>, indexAndImage: [number, ImagePiece]) => {
        setIsDragging(true);
        setDraggedImage(indexAndImage);
        setTargetPieceIndex(indexAndImage[0]);
        setCursorPosition({x: event.clientX, y: event.clientY});
        event.preventDefault();

        const img = event.currentTarget;
        img.style.display = 'none';
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLSpanElement>) => {
        if (isDragging && draggedImageWithIndex !== null) {
            setCursorPosition({x: event.clientX, y: event.clientY});
            const images = document.querySelectorAll('img');

            for (let i = 0; i < images.length; i++) {
                const rect = (images[i] as HTMLImageElement).getBoundingClientRect();
                if (
                    event.clientX >= rect.left &&
                    event.clientX <= rect.right &&
                    event.clientY >= rect.top &&
                    event.clientY <= rect.bottom &&
                    i !== draggedImageWithIndex[0]
                ) {
                    setTargetPieceIndex(i);
                    break;
                }
            }
        }
    };

    const handleMouseUp = (event: React.MouseEvent) => {
        if (isDragging && draggedImageWithIndex !== null) {
            const gridRect = gridRef.current?.getBoundingClientRect();

            if (gridRect) {
                const isInsideGrid =
                    event.clientX >= gridRect.left &&
                    event.clientX <= gridRect.right &&
                    event.clientY >= gridRect.top &&
                    event.clientY <= gridRect.bottom;

                if (isInsideGrid && targetPieceIndex !== null) {
                    // Меняем местами, только если отпущено внутри контейнера
                    const updatedPieces = [...imagePieces];
                    [updatedPieces[draggedImageWithIndex[0]], updatedPieces[targetPieceIndex]] = [
                        updatedPieces[targetPieceIndex],
                        updatedPieces[draggedImageWithIndex[0]],
                    ];
                    setImagePieces(updatedPieces);
                } else {
                    // Если отпущено вне контейнера, возвращаем изображение на старую позицию
                    const originalIndex = draggedImageWithIndex[0];
                    setTargetPieceIndex(originalIndex); // Обнуляем целевой индекс
                }
            }

            const img = gridRef.current?.children[draggedImageWithIndex[0]] as HTMLImageElement;
            if (img) img.style.display = 'flex';
        }
        setIsDragging(false);
        setDraggedImage(null);
        setTargetPieceIndex(null);
    };

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
        const canvasUrls: string[] = [];
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
                    canvasUrls.push(canvas.toDataURL());
                }
            }
        }
        const pieces: ImagePiece[] = [];
        for (const [index, canvasUrl] of canvasUrls.entries()) {
            pieces.push({orderNo: index, url: canvasUrl});
        }
        setImagePieces(pieces);
    };
    let cellWidth: number = 0;
    let cellHeight: number = 0;

    const calculateCellWidth = () => {
        if (emptyGridRef.current) {
            cellWidth = emptyGridRef.current.clientWidth / numColsToCut;
            cellHeight = emptyGridRef.current.clientHeight / numRowsToCut;
        }
    };

    calculateCellWidth();

    return (
        <span
            className={
                "absolute top-[0] w-screen h-screen  flex flex-col " +
                "items-center justify-center text-center align-middle gap-4"
            }
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}>
            <div className="grid grid-flow-col grid-rows-4 bg-gray-800 max-w-[1080px]" ref={emptyGridRef}>

                {Array.from({length: numColsToCut * numRowsToCut}).map((_, index) => (
                    <canvas
                        key={index}
                        width={widthOfOnePiece}
                        height={heightOfOnePiece}
                        title={String(index)}
                        className="w-full h-auto bg-gray-600 hover:bg-gray-500 border"
                    />
                ))}
            </div>
            <div className="grid grid-flow-col grid-rows-1 gap-1 max-w-full overflow-y-scroll"
                 ref={gridRef}
            >
                {imagePieces.map((image, index) => (
                    <img
                        key={index}
                        src={image.url}
                        alt={`Piece ${index}`}
                        title={String(image.orderNo)}
                        width={cellWidth}
                        style={{minWidth: cellWidth + "px", transition: "all 0.5s ease"}}
                        className="h-auto min-w-36"
                        onMouseDown={(e) => handleMouseDown(e, [index, image])}
                    />
                ))}
            </div>

            {isDragging && draggedImageWithIndex && (
                <img
                    src={draggedImageWithIndex[1].url}
                    alt="Dragging piece"
                    width={cellWidth}
                    style={{
                        position: 'absolute',
                        left: `${cursorPosition.x - cellWidth / 2}px`,
                        top: `${cursorPosition.y - cellHeight / 2}px`,
                        pointerEvents: 'none',
                        zIndex: 999,
                    }}
                />
            )}

        </span>
    );
};
