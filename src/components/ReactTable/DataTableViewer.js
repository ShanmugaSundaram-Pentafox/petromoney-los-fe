import React, { useEffect, useMemo, useState } from 'react';
import { ActionIcon, Box, Grid, Group, Popover, Select, Text, TextInput, Title, Tooltip } from '@mantine/core';
import ReactTable from './ReactTable';
import { IconDownload, IconFilter, IconSearch, IconTableRow } from '@tabler/icons-react';
import { exportToExcel } from "react-json-to-excel";
import ColumnsFilter from '../Filter/ColumnFilter';
import { useDisclosure } from '@mantine/hooks';

const Filter = ({
  column,
  table,
}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return (
    <>
      <Text size='xs' c={'gray'}>{column.columnDef.header}</Text>
      <Select
        value={columnFilterValue ? columnFilterValue : 'All'}
        defaultValue={'All'}
        onChange={(e) => { e === 'All' ? column.setFilterValue() : column.setFilterValue(e) }}
        clearable
        data={['All', ...sortedUniqueValues]}
        maxDropdownHeight={200}
      />
    </>
  )
}

const DataTableViewer = ({
  column = [],
  rowData = [],
  useAPIPagination = false,
  title,
  excelDownload = false,
  apiSearch,
  onRowClick,
  page,
  filter = true,
  columnsFilter = true,
  setPage,
  styles = {},
  totalNoOfPages,
  action = false,
}) => {
  const [search, setSearch] = useState();
  const [filterHeader, setFilterHeader] = useState();
  const [opened, setOpened] = useState();
  const [openFilterModal, { open, close }] = useDisclosure(false);
  // const { tableData, setTableData } = useTableInfo();
  // const { tableData, saveTableData } = useTableColumnsStore(store => ({
  //   tableData: store?.getTableData(localKey),
  //   saveTableData: store?.saveTableData,
  // }))
  const [filteredColumnData, setFilteredColumnData] = useState([]);

  const addCellKey = (filteredColumn, actualColumn) => {
    /** It searches for an element in the actualColumn array that has a header property equal to the current element in the filteredColumn array. */
    /** If a matching element is found, the function returns the array of objects. */
    return filteredColumn?.reduce((temp, actItem) => {
      return temp.concat(
        actualColumn?.find((item) => actItem === item?.header)
      );
    }, []);
  };

  useEffect(() => {
    if ((column?.length)) {
      // if (tableData) {
      //   const addData = addCellKey(tableData, column)
      //   const buffer = addData?.map(item => item?.header)
      //   setFilteredColumnData(addData)
      //   saveTableData({ [localKey]: buffer });
      // }
      // else
      setFilteredColumnData(column)
    }
    else
      setFilteredColumnData(column)
  }, [column])

  const onUpdateFilter = (data) => {
    const addData = addCellKey(data, column);
    setFilteredColumnData(addData);
    // saveTableData({ [localKey]: data })
  }

  return (
    <Box>
      <Box style={{ padding: 10, background: '#ffff', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
        <Group justify='space-between'>
          <Box>
            <Text style={{ fontSize: '16px' }} fw={500}>{title}</Text>
          </Box>
          <Box mr={'sm'}>
            <Box style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
              <TextInput
                placeholder="Search"
                onChange={(e) => {
                  apiSearch
                    ? apiSearch(e.target.value)
                    : setSearch(e.target.value);
                }}
                mx={0}
                size='xs'
                icon={<IconSearch size={16} />}
              />
              {columnsFilter
                ? <Tooltip
                  label={<Text size={"xs"}>Manage Columns</Text>}
                  color={"dark"}
                  transitionProps={{ transition: "pop", duration: 300 }}
                  withArrow
                  position='bottom'
                >
                  <ActionIcon size={'md'} variant='light' color='teal.8' onClick={open}>
                    <IconTableRow size={20} style={{ cursor: 'pointer' }} />
                  </ActionIcon>
                </Tooltip>
                : null
              }
              {filter
                ? <Popover opened={opened} onChange={setOpened} position="left-start" withArrow shadow="md">
                  <Popover.Target>
                    <Tooltip
                      label={<Text size={"xs"}>Filter Rows</Text>}
                      color={"dark"}
                      transitionProps={{ transition: "pop", duration: 300 }}
                      withArrow
                      position='bottom'
                    >
                      <ActionIcon size={'md'} variant='light' color='teal.8'>
                        <IconFilter size={20} onClick={() => setOpened(!opened)} />
                      </ActionIcon>
                    </Tooltip>
                  </Popover.Target>
                  <Popover.Dropdown mr={'md'}>
                    <Title order={'6'}>Filter</Title>
                    <Grid w={300} gutter={'sm'}>
                      {filterHeader?.getHeaderGroups().map((headerGroup) => (headerGroup?.headers?.map((header) =>
                        header.column.getCanFilter()
                          ? (
                            <Grid.Col span={6} key={header.id}>
                              <Filter column={header.column} table={filterHeader} />
                            </Grid.Col>
                          )
                          : null
                      )))}
                    </Grid>
                  </Popover.Dropdown>
                </Popover>
                : null
              }
              {excelDownload
                ? (<Tooltip
                  label={<Text size={"xs"}>Download</Text>}
                  color={"dark"}
                  transitionProps={{ transition: "pop", duration: 300 }}
                  withArrow
                  position='bottom'
                >
                  <ActionIcon size={'md'} variant='light' color='teal.8'>
                    <IconDownload size={20} onClick={() => { exportToExcel(rowData, title) }} />
                  </ActionIcon>
                </Tooltip>)
                : null}
              {action ? action : null}
            </Box>
          </Box>
        </Group>
      </Box>
      <ReactTable
        columnData={filteredColumnData}
        rowData={rowData || []}
        useApiPagination={useAPIPagination}
        search={search}
        setSearch={setSearch}
        setFilterHeader={setFilterHeader}
        filterHeader={filterHeader}
        onRowClick={onRowClick}
        styles={styles}
        page={page}
        setPage={setPage}
        totalNoOfPages={totalNoOfPages}
      />
      <ColumnsFilter
        title={title}
        columnData={column}
        filteredColumnData={filteredColumnData || []}
        opened={openFilterModal}
        onClose={close}
        updateFilter={onUpdateFilter}
      />
    </Box>
  )
};

export default DataTableViewer;