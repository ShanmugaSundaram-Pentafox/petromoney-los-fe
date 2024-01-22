import { Box, Modal, Title, Text, Tooltip, ActionIcon } from "@mantine/core";
import COLORS from "../../theme/colors.js";
import FilterModal from "./FilterModal";
import React from "react";
// import { displayNotification } from "../CommonComponents/Notification/displayNotification";

const ColumnsFilter = ({
  title,
  columnData = [],
  filteredColumnData,
  updateFilter,
  opened = false,
  onClose,
}) => {

  const onUpdateColumn = (data) => {
    if (data?.length) {
      // callback to update localstorage and table state
      updateFilter(data)
      close();
    }
    // else {
    //   displayNotification({ message: 'Select columns to update', variant: 'warning' })
    // }
  }

  return (
    <Box>
      {
        columnData?.length ? (
          <Modal
            size={'xl'}
            opened={opened}
            onClose={onClose}
            lockScroll
            title={
              <div>
                <Title order={3}>Manage columns</Title>
                <Text color={COLORS.text.light1} size={'sm'}>
                  Select the columns you would like to see on {title}
                </Text>
              </div>
            }
            style={{ position: 'absolute', zIndex: 9999 }}
          >
            <FilterModal
              filteredColumnData={filteredColumnData}
              columnData={columnData}
              onUpdateColumn={onUpdateColumn}
              onClose={onClose}
            />
          </Modal>
        ) : null
      }
    </Box>
  )
}

export default ColumnsFilter;