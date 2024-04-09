import { DndContext, useSensor, PointerSensor, closestCenter } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import DraggableListItem from './DraggableListItems';

const DraggableList = ({ listData = [], containerStyle, onChange }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(listData?.map((d, index) => ({
      id: index + 1,
      value: d
    })))
  }, [listData])

  useEffect(() => {
    if (data.length) {
      onChange(data?.map(item => item?.value))
    }
  }, [data])

  const sensors = [useSensor(PointerSensor)]

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      setData((d) => {
        const oldIndex = d?.findIndex(item => item?.id === active?.id);
        const newIndex = d?.findIndex(item => item?.id === over?.id);
        return arrayMove(d, oldIndex, newIndex);
      });
    }
  }

  if (listData?.length === 0) {
    return null;
  }

  return (
    <Box style={containerStyle}>
      {/*DndContext global component where all the drag and drop process will happen */}
      <DndContext
        sensors={sensors}
        // collision detection how dnd will determine that we are hovering or not
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        {/* SortableContext keep track of all the items and provide all the data needed for the component to move/slide */}
        <SortableContext
          // have to pass array of string/integer to the items.
          // sortableContext needs only ID version.
          items={data?.map(item => item?.id)}
          // verticalListSortingStrategy is only to move the list up and down.
          strategy={verticalListSortingStrategy}
        >
          {
            data?.map(item => <DraggableListItem id={item?.id} name={String(item?.value)} key={item?.id} />)
          }
        </SortableContext>
      </DndContext>
    </Box>
  );
};

export default DraggableList;
