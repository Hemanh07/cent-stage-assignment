import React from 'react';
import { useDrag } from 'react-dnd';

const ITEM_TYPE = 'event';

const DraggableEventWrapper = ({ event, children }) => {
    const [, dragRef] = useDrag({
        type: ITEM_TYPE,
        item: { ...event },
    });

    return <div ref={dragRef}>{children}</div>;
};

export default DraggableEventWrapper;
