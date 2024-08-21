'use client';

import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { ItemTypes } from '../constants';

interface DraggableComponentInCanvasProps {
    id: string;
    index: number;
    type: string;
    moveComponent: (dragIndex: number, hoverIndex: number) => void;
    children: JSX.Element;
}

export const DraggableComponentInCanvas: React.FC<DraggableComponentInCanvasProps> = ({
    id,
    index,
    type,
    moveComponent,
    children
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const items = Object.values(ItemTypes)
    const [, drop] = useDrop({
        accept: items,
        hover: (item: { id: number, index: number }) => {
            console.log(item.index,item.id)
            if (item.index !== index) {
                moveComponent(item.index, index);
                item.index = index;
            }
        },

    });

    const [, drag] = useDrag({
        type,
        item: { id, index },
        end: (item, monitor) => {
            console.log(item)
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref)); // Forward both refs

    return (
        <div ref={ref} id={id} style={{
            cursor: 'move',
        }}>
            {children}
        </div>
    );
};
