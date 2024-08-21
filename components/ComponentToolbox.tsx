// components/ComponentToolbox.tsx
'use client';

import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants';
import { Clocks, DivComponent, Hero, SectionComponent } from '.';

interface DraggableComponentProps {
    type: string;
    component: JSX.Element;
}


const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, component }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type,
        item: { type },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            console.log(dropResult)
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag as any} style={{ opacity: isDragging ? 0.2 : 1, marginBottom: '10px' }}>
            {type}
        </div>
    );
};

export const ComponentToolbox: React.FC = () => {

    return (
        <div     style={{
            padding: "16px",
            borderRight: "1px solid rgba(100,100,100,0.2)",
            width: "256px",
            left:'0px',
            height: '100vh',
            position:'fixed'
          }}>
            <h3>Components</h3>
            <DraggableComponent type={ItemTypes.SECTION} component={<SectionComponent />} />
            <DraggableComponent type={ItemTypes.DIV} component={<DivComponent />} />
            <DraggableComponent type={ItemTypes.CLOCK} component={<Clocks />} />
            <DraggableComponent type={ItemTypes.HERO} component={<Hero />} />
        </div>
    );
};
