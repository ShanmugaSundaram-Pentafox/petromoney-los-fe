import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Text } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import React from "react";

const DraggableListItem = ({ name, id }) => {

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: id })

  const style = {
    transition,
    // transform provided by useSortableHook is in different format to covert it to css format we are using CSS from dnd utilities.
    transform: CSS.Transform.toString(transform),
    border: '1px solid rgb(0,0,0,0.1)',
    padding: 10,
    marginRight: 10,
    borderRadius: 4,

  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Box mt='xs' style={[{ display: 'flex', alignItems: 'center', cursor: 'move' }, style]}>
        <IconGripVertical
          size={20}
          color='rgb(0,0,0,0.3)'
          style={{ marginRight: 12, marginTop: 0 }}
        />
        <Text size='sm'>{name}</Text>
      </Box>
    </div>
  )
}

export default DraggableListItem;