import React, { useEffect, useMemo, useState } from 'react';
import { ActionIcon, Box, Grid, Group, Image, Loader, Popover, ScrollArea, Select, Text, TextInput, Tooltip } from '@mantine/core';
import ReactTable from './ReactTable';
import { IconDownload, IconFilter, IconSearch, IconTableRow, IconX } from '@tabler/icons-react';
import ColumnsFilter from '../Filter/ColumnFilter';
import { useDisclosure } from '@mantine/hooks';
import { useJsonToCsv } from 'react-json-csv';
import { generateCSVHeader, generateTableHeader } from '../../utils/tableHeader.util';
import StatusList from '../CommonComponents/StatusList';

const Filter = ({
  column,
  table,
}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort()?.map((i) => (i?.replace(/_/g, ' '))),
    [column.getFacetedUniqueValues()]
  );

  return (
    <>
      <Text size='xs' c={'gray'}>{column.columnDef.header}</Text>
      <Select
        size='xs'
        styles={{
          dropdown: {
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
          },
          option: {
            textTransform: 'capitalize'
          }
        }}
        placeholder='All'
        comboboxProps={{ offset: 2 }}
        value={columnFilterValue}
        onChange={(e) => { column.setFilterValue(e) }}
        clearable
        data={sortedUniqueValues?.filter(i => i !== undefined) || []}
        maxDropdownHeight={200}
      />
    </>
  )
}

const DataTableViewer = ({
  column = [],
  rowData = [],
  useAPIPagination = false,
  downloadQuery,
  title,
  excelDownload = false,
  apiSearch,
  showStatusTab,
  onRowClick,
  noDataText = 'No data yet!',
  noDataSubText = 'No data found in this section',
  page,
  filter = true,
  columnsFilter = true,
  count = false,
  setPage,
  loading = false,
  styles = {},
  totalNoOfPages,
  action = false,
  showAction = false,
}) => {
  const [search, setSearch] = useState();
  const [filterHeader, setFilterHeader] = useState();
  const [opened, setOpened] = useState();
  const [openFilterModal, { open, close }] = useDisclosure(false);
  const { saveAsCsv } = useJsonToCsv()
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
      return temp?.concat(
        actualColumn?.find((item) => actItem === item?.header)
      );
    }, []);
  };

  const getTableColumns = useMemo(() => {
    return generateTableHeader({ data: column });
  }, [column])

  const getCSVColumns = useMemo(() => {
    return generateCSVHeader({ data: column });
  }, [column])

  useEffect(() => {
    if ((getTableColumns?.length)) {
      // if (tableData) {
      //   const addData = addCellKey(tableData, getTableColumns)
      //   const buffer = addData?.map(item => item?.header)
      //   setFilteredColumnData(addData)
      //   saveTableData({ [localKey]: buffer });
      // }
      // else
      setFilteredColumnData(getTableColumns)
    }
    else
      setFilteredColumnData(getTableColumns)
  }, [getTableColumns])

  const onUpdateFilter = (data) => {
    const addData = addCellKey(data, getTableColumns);
    setFilteredColumnData(addData);
    // saveTableData({ [localKey]: data })
  }

  return (
    <Box>
      <Box style={{ padding: 10, background: '#ffff', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
        <Group justify='space-between'>
          <Text style={{ fontSize: '16px' }} fw={500}>
            <Group gap={4}>
              {title + ' '}
              {count
                ? <>
                  ({loading
                    ? <Loader mb={4} type='dots' size={'xs'} />
                    : count})
                </>
                : null
              }
            </Group>
          </Text>
          {(!loading && Array.isArray(rowData) && !rowData?.length && !search)
            ? null
            : (
              <Box mr={'sm'}>
                <Box style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                  <TextInput
                    placeholder="Search"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      apiSearch && apiSearch(e.target.value)
                    }}
                    value={search}
                    mx={0}
                    size='xs'
                    icon={<IconSearch size={16} />}
                    rightSection={<IconX size={12} color={'#ccc'} style={{ cursor: 'pointer' }} onClick={() => { setSearch(''); apiSearch && apiSearch() }} />}
                  />
                  {columnsFilter
                    ? <Tooltip
                      label={<Text size={'xs'}>Manage Columns</Text>}
                      color={'dark'}
                      transitionProps={{ transition: 'pop', duration: 300 }}
                      withArrow
                      position='bottom'
                    >
                      <ActionIcon size={'md'} variant='outline' onClick={open} color='gray.4'>
                        <IconTableRow size={20} style={{ cursor: 'pointer' }} color='#4196f0' />
                      </ActionIcon>
                    </Tooltip>
                    : null
                  }
                  {filter ?
                    <Popover
                      opened={opened}
                      onChange={setOpened}
                      position="left-start"
                      withArrow
                      shadow="md"
                      styles={{
                        dropdown: {
                          boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'
                        }
                      }}
                    >
                      <Popover.Target>
                        <Tooltip
                          label={<Text size={'xs'}>Filter Rows</Text>}
                          color={'dark'}
                          transitionProps={{ transition: 'pop', duration: 300 }}
                          withArrow
                          position='bottom'
                        >
                          <ActionIcon size={'md'} variant='outline' color='gray.4'>
                            <IconFilter size={20} onClick={() => setOpened(!opened)} color='#4196f0' />
                          </ActionIcon>
                        </Tooltip>
                      </Popover.Target>
                      <Popover.Dropdown mr={'md'}>
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
                      label={<Text size={'xs'}>Download</Text>}
                      color={'dark'}
                      transitionProps={{ transition: 'pop', duration: 300 }}
                      withArrow
                      position='bottom'
                    >
                      <ActionIcon
                        size={'md'}
                        variant='outline'
                        color='gray.4'
                        loading={downloadQuery?.isLoading}
                        onClick={() => {
                          downloadQuery
                            ? downloadQuery?.query()
                            : saveAsCsv({
                              data: rowData,
                              fields: getCSVColumns,
                              fileName: title,
                            })
                        }}
                      >
                        <IconDownload size={20} color='#4196f0' />
                      </ActionIcon>
                    </Tooltip>)
                    : null}
                  {action ? action : null}
                  {showAction ? showAction : null}
                </Box>
              </Box>
            )}
          {(!loading && Array.isArray(rowData) && !rowData?.length && showAction) ? showAction : null}
        </Group>
      </Box>
      {showStatusTab ? <Box>
        {showStatusTab}
      </Box> : null}
      {!loading && Array.isArray(rowData) && !rowData.length ? (
        <Box
          mt="md"
          p="xl"
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 10,
            height: '60vh',
          }}
        >
          <Image
            src="https://i.imgur.com/A6KRQAV.png"
            w={150}
            h={100}
            radius="md"
          />
          <Box>
            <Text>{noDataText}</Text>
            <Text size="sm" sx={{ color: 'rgb(0,0,0,0.4)' }}>
              {noDataSubText}
            </Text>
          </Box>
        </Box>
      ) : (
        <ReactTable
          columnData={filteredColumnData}
          rowData={rowData || []}
          useApiPagination={useAPIPagination}
          search={apiSearch ? null : search}
          setSearch={setSearch}
          setFilterHeader={setFilterHeader}
          filterHeader={filterHeader}
          onRowClick={onRowClick}
          styles={styles}
          page={page}
          setPage={setPage}
          totalNoOfPages={totalNoOfPages}
          loading={loading}
        />
      )}
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