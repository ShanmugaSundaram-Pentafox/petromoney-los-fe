import { Badge, Box, Button, Checkbox, Grid, Group, TextInput, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import DraggableList from "../DND/DraggableList";
import { IconSearch } from "@tabler/icons-react";

const FilterModal = ({
  columnData,
  filteredColumnData,
  onUpdateColumn,
  onClose,
}) => {
  // filteredColumndata is the data which is stored in localStorage of the table
  const [filteredData, setFilteredData] = useState(filteredColumnData?.map(item => item?.header));
  const [data, setData] = useState(columnData?.map(item => item?.header))
  const [demoData, setDemoData] = useState(columnData?.map(item => item?.header))
  const [columnSearchData, setColumnSearchData] = useState(filteredData)
  const [appropriation, setAppropriation] = useState([])
  const [columnSearch, setColumnSearch] = useState()
  const [search, setSearch] = useState()

  useEffect(() => {
    if (search) {
      const res = data?.filter((entry) =>
        entry?.toLowerCase()?.includes(search?.toLowerCase())
      );
      setDemoData(res)
    }
    else {
      setDemoData(columnData?.map(item => item?.header))
    }
  }, [search])

  useEffect(() => {
    if (columnSearch) {
      const res = filteredData?.filter((entry) =>
        entry?.toLowerCase()?.includes(columnSearch?.toLowerCase())
      );
      setColumnSearchData(res)
    }
    else {
      setColumnSearchData(filteredData)
    }
  }, [columnSearch, filteredData])
  return (
    <Box>
      <Grid style={{
        borderTop: '2px solid rgb(0,0,0,0.1)',
        borderBottom: '2px solid rgb(0,0,0,0.1)',
        margin: 0
      }}>
        <Grid.Col span={6} p={10 * 2} pb={0} pl={10} pt={20} >
          <Title order={6}>Column Options</Title>
          <TextInput
            mt={10}
            mb={10}
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            icon={<IconSearch size={16} />}
          />
          <Box style={{
            overflow: 'auto',
            maxHeight: '50vh',
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'row',
          }}>
            <Checkbox.Group value={filteredData} onChange={setFilteredData}>
              <Group>
                {
                  demoData?.map((item, i) => <Checkbox key={i} style={{ minWidth: '90%' }} styles={(theme) => ({ label: { cursor: 'pointer' }, input: { cursor: 'pointer' } })} mt={8} ml={8} value={item} label={item} />)
                }
              </Group>
            </Checkbox.Group>
          </Box>
        </Grid.Col>
        <Grid.Col span={6} style={{ borderLeft: '2px solid rgb(0,0,0,0.1)' }} p={10 * 2} pb={10} pr={0}>
          <Box style={{ display: 'flex' }}>
            <Title order={6}>Selected Columns</Title>
            <Badge variant="light" ml={'xs'} color="indigo">{filteredData?.length}</Badge>
          </Box>
          <TextInput
            mt={10}
            mb={10}
            mr={10}
            placeholder="Search"
            onChange={(e) => setColumnSearch(e.target.value)}
            icon={<IconSearch size={16} />}
          />
          <DraggableList
            containerStyle={{
              overflow: 'auto',
              maxHeight: '50vh',
              minHeight: '50vh',
            }}
            listData={columnSearchData}
            onChange={setAppropriation}
          />
        </Grid.Col>
      </Grid>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
        mt={"md"}
      >
        <Button
          variant='outline'
          size='sm'
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          style={{ minWidth: 90 }}
          color='green'
          variant='filled'
          size='sm'
          onClick={() => onUpdateColumn(appropriation)}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default FilterModal;