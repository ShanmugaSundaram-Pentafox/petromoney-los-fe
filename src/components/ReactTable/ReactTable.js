import { ActionIcon, Box, Paper, ScrollArea, Skeleton, Table, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconChevronsRight } from "@tabler/icons-react";
import { IconChevronsLeft } from "@tabler/icons-react";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import { useState } from "react";

// render the table view 
// using the mantine and react table.
const ReactTable = ({
    rowData,
    columnData,
    onRowClick = () => null,
    search,
    setSearch,
    allowSorting = false,
    loading,
    page,
    setPage,
    useApiPagination = false,
    totalNoOfRecords,
    totalNoOfPages,
    sorting,
    setSorting,
    apiSorting = false,
    isSortingRemoval = true,
    styles,
}) => {
    const [data, setData] = useState([]);
    const [debounce] = useDebouncedValue(search, 400);

    const fuzzyFilter = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({
            itemRank,
        });
        return itemRank.passed;
    };


    useEffect(() => {
        setData([...rowData]);
    }, [rowData]);

    const table = useReactTable({
        data,
        columns: columnData,
        state: {
            globalFilter: debounce,
            sorting: sorting,
        },
        onGlobalFilterChange: setSearch,
        manualSorting: apiSorting ? true : false,
        onSortingChange: setSorting,
        globalFilterFn: fuzzyFilter,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableSortingRemoval: isSortingRemoval,
    });

    if (loading) {
        return (
            <Paper mt={10}>
                <Table
                    highlightOnHover
                    fontSize="xs"
                    mb={10}
                    verticalSpacing="xs"
                    sx={{ ...styles }}
                >
                    <Table.Tbody>
                        {
                            Array(10)
                                .fill()
                                .map((_, rowKey) => (
                                    <Table.Tr key={`row-${rowKey}`}>
                                        {Array(6).fill().map((_, cellKey) => (
                                            <Table.Td key={`cell-${cellKey}`}>
                                                <Skeleton height={20} />
                                            </Table.Td>
                                        ))}
                                    </Table.Tr>
                                ))
                        }
                    </Table.Tbody>
                </Table>
            </Paper>
        )
    }

    return (
        <>
            <Paper mt={10}>
                <ScrollArea>
                    <Table
                        highlightOnHover
                        fontSize="xs"
                        mb={10}
                        verticalSpacing="xs"
                        sx={{ ...styles }}
                    >
                        <Table.Thead style={{ backgroundColor: 'rgba(228, 237, 253, 1)' }}>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Table.Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header, index) => (
                                        <Table.Th key={header.id} colSpan={header.colSpan} style={{ cursor: header.column?.getCanSort() && "pointer" }}>
                                            {header.isPlaceholder ? null : (
                                                <div onClick={allowSorting ? header.column.getToggleSortingHandler() : undefined}>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: " 🔼",
                                                        desc: " 🔽",
                                                    }[header.column.getIsSorted()] ?? null}
                                                </div>
                                            )}
                                        </Table.Th>
                                    ))}
                                </Table.Tr>
                            ))}
                        </Table.Thead>
                        <Table.Tbody>
                            {
                                table.getRowModel().rows.map((row) => (
                                    <Table.Tr style={{ cursor: typeof onRowClick === 'function' ? 'pointer' : 'default' }} onClick={() => { typeof onRowClick === 'function' && onRowClick(row?.original) }} key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <Table.Td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Table.Td>
                                        ))}
                                    </Table.Tr>
                                ))
                            }
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>
            <Box
                mt="md"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {useApiPagination ?
                    <>
                        {totalNoOfPages ? (
                            <>
                                <Box>
                                    <Box sx={{ display: "flex", gap: 10, alignItems: "center" }}>
                                        <Text size="xs" sx={{ color: "rgb(0,0,0,0.5)" }}>
                                            <strong>{`Showing Page ${page} - ${totalNoOfPages}`}</strong>
                                        </Text>
                                        {/* {totalNoOfRecords > 10 ?
                                            <Select
                                                menuPlacement="top"
                                                options={no_of_records}
                                                onChange={(e) => { table.setPageSize(e.value); setRowLength(e); }}
                                                value={rowLength}
                                                styles={{
                                                    menu: (provided) => ({ ...provided, zIndex: 9999, padding: '0' }),
                                                    option: (provided) => ({
                                                        ...provided,
                                                        fontSize: "10px",
                                                        padding: "5px 10px 5px 10px",
                                                    }),
                                                    control: (provided) => ({
                                                        ...provided,
                                                        padding: 0,
                                                        fontSize: "10px",
                                                        maxHeight: 10,
                                                    }),
                                                }}
                                            /> : null
                                        } */}
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    {page != 1 && (
                                        <ActionIcon variant="light" onClick={() => setPage(1)}>
                                            <IconChevronsLeft size={16} />
                                        </ActionIcon>
                                    )}
                                    {page != 1 && (
                                        <ActionIcon variant="light" onClick={() => setPage(page - 1)}>
                                            <Text size="xs" sx={{ color: "rgb(0,0,0,0.5)" }}>
                                                {page - 1}
                                            </Text>
                                        </ActionIcon>
                                    )}
                                    {page >= 1 && (
                                        <ActionIcon variant="light" color="blue">
                                            <Text size="xs" sx={{ color: "rgb(0,0,0,0.5)" }}>
                                                {page}
                                            </Text>
                                        </ActionIcon>
                                    )}
                                    {totalNoOfPages != 1 && totalNoOfPages != page && (
                                        <ActionIcon variant='light' onClick={() => setPage(page + 1)}>
                                            <Text size='xs' sx={{ color: 'rgb(0,0,0,0.5)' }}>
                                                {page + 1}
                                            </Text>
                                        </ActionIcon>
                                    )}
                                    {totalNoOfPages != 1 && totalNoOfPages != page && (
                                        <ActionIcon variant='light' onClick={() => setPage(totalNoOfPages)}>
                                            <IconChevronsRight size={16} />
                                        </ActionIcon>
                                    )}
                                    {totalNoOfRecords ? (
                                        <Box>
                                            <Text size="xs" sx={{ color: "rgb(0,0,0,0.5)" }}>
                                                {totalNoOfRecords} Records
                                            </Text>
                                        </Box>
                                    ) : null}
                                </Box>
                            </>
                        ) : null}
                    </>
                    :
                    <>
                        <Box>
                            <Text size="xs" sx={{ color: "rgb(0,0,0,0.5)" }}>
                                <strong>{`Showing Page ${table.getState().pagination.pageIndex + 1
                                    } - ${table.getPageCount()}`}</strong>
                            </Text>
                        </Box>
                        <Box sx={{ display: "flex", gap: 10, alignItems: "center" }}>
                            {table.getState().pagination.pageIndex != 0 && (
                                <ActionIcon
                                    variant="light"
                                    onClick={() => table.setPageIndex(0)}
                                >
                                    <IconChevronsLeft size={16} />
                                </ActionIcon>
                            )}
                            {table.getState().pagination.pageIndex != 0 && (
                                <ActionIcon
                                    variant="light"
                                    onClick={() => table.previousPage()}
                                >
                                    <Text size="xs" sx={{ color: "rgb(0,0,0,0.5)" }}>
                                        {table.getState().pagination.pageIndex}
                                    </Text>
                                </ActionIcon>
                            )}
                            {table.getState().pagination.pageIndex >= 0 && (
                                <ActionIcon variant="light" color="blue">
                                    <Text size="xs" sx={{ color: "rgb(0,0,0,0.5)" }}>
                                        {table.getState().pagination.pageIndex + 1}
                                    </Text>
                                </ActionIcon>
                            )}
                            {table.getPageCount() != 0 &&
                                table.getPageCount() !=
                                table.getState().pagination.pageIndex + 1 && (
                                    <ActionIcon variant="light" onClick={() => table.nextPage()}>
                                        <Text size="xs" sx={{ color: "rgb(0,0,0,0.5)" }}>
                                            {table.getState().pagination.pageIndex + 2}
                                        </Text>
                                    </ActionIcon>
                                )}
                            {table.getPageCount() != 0 &&
                                table.getPageCount() !=
                                table.getState().pagination.pageIndex + 1 && (
                                    <ActionIcon
                                        variant="light"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    >
                                        <IconChevronsRight size={16} />
                                    </ActionIcon>
                                )}
                            {data?.length ? (
                                <Box>
                                    <Text size="xs" sx={{ color: "rgb(0,0,0,0.5)" }}>
                                        {data?.length} Records
                                    </Text>
                                </Box>
                            ) : null}
                        </Box>
                    </>
                }
            </Box>
        </>
    );
};

export default ReactTable;