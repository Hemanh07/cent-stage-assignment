import React from 'react';
import { useDrop } from 'react-dnd';

const ITEM_TYPE = 'event';

const DroppableDateCellWrapper = ({ children, value, onDrop }) => {
    const [, dropRef] = useDrop({
        accept: ITEM_TYPE,
        drop: (item) => {
            const newStart = new Date(value);
            const duration = new Date(item.end) - new Date(item.start);
            const newEnd = new Date(newStart.getTime() + duration);

            onDrop(item._id, {
                ...item,
                start: newStart,
                end: newEnd
            });
        },
    });

    return <div ref={dropRef}>{children}</div>;
};

export default DroppableDateCellWrapper;
