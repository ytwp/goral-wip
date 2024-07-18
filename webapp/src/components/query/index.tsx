import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { ArrowLeftIcon, CardStackPlusIcon, CaretSortIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, Cross2Icon, DotsHorizontalIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon, MagnifyingGlassIcon, PlayIcon, PlusIcon, StopIcon, TableIcon, UpdateIcon } from "@radix-ui/react-icons";
import { ConfigProvider, TreeDataNode } from "antd";
import DirectoryTree from "antd/es/tree/DirectoryTree";
import { TableOutlined, PartitionOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import MonacoEditor from "../code/monaco-editor";
import Code from "../code/";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";


const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
]

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "show-auto-index",
    header: ({ table }) => (
      <div></div>
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">{row.index + 1}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ table }) => (
      <div className="text-xs">Status</div>
    ),
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex justify-between">
          <div className="text-xs">Email</div>
          <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
            <CaretSortIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className="text-xs">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-xs">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-xs">{formatted}</div>
    },
  },
]


type MenuModeToggleProps = {
  node: any;
}

export function ContextMenuDemo(props: MenuModeToggleProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">
        {props.node.title}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Bookmarks Bar
          <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function Query() {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const treeData: TreeDataNode[] = [
    {
      title: 'mysql',
      key: 'mysql',
      icon: <DeploymentUnitOutlined />,
      children: [
        {
          title: 'test',
          key: 'mysql.test',
          icon: <PartitionOutlined />,
          children: [
            { title: 'test_table', key: 'mysql.test.test_table', icon: <TableOutlined />, isLeaf: true },
            { title: 'student', key: 'mysql.test.student', icon: <TableOutlined />, isLeaf: true },
          ],
        },
      ],
    },
    {
      title: 'postgresql',
      key: 'postgresql',
      icon: <DeploymentUnitOutlined />,
      children: [
        {
          title: 'test',
          key: 'postgresql.test',
          icon: <PartitionOutlined />,
          children: [
            { title: 'test_table', key: 'postgresql.test.test_table', icon: <TableOutlined />, isLeaf: true },
            { title: 'student', key: 'postgresql.test.student', icon: <TableOutlined />, isLeaf: true },
          ],
        },
        {
          title: 'user',
          key: 'postgresql.user',
          icon: <PartitionOutlined />,
          children: [
            { title: 'user_info', key: 'postgresql.user.user_info', icon: <TableOutlined />, isLeaf: true },
            { title: 'student', key: 'postgresql.user.student', icon: <TableOutlined />, isLeaf: true },
          ],
        },
      ],
    },
  ];

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [rightSize, setRightSize] = useState(80);
  const [rightTopSize, setRightTopSize] = useState(70);
  const [rightBottomSize, setRightBottomSize] = useState(30);


  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (<div className="h-full" ref={containerRef}>
    <ResizablePanelGroup
      direction="horizontal"
      className="border h-full"
    // onLayout={(e) => { console.log(e) }}
    >
      <ResizablePanel defaultSize={20} minSize={10}>
        <div className="h-full">
          <div className="border-b p-2">
            <div className="flex w-full after:items-center space-x-2">
              <Input type="text" placeholder="" />
              <Button type="submit" variant="outline" size="icon" className="w-9 h-9 min-w-9" >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </Button>
              <Button type="submit" variant="outline" size="icon" className="w-9 h-9 min-w-9" >
                <CardStackPlusIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="h-full p-3">
            <ConfigProvider
              theme={{
                token: {
                  colorBgContainer: 'transparent',
                  colorText: ''
                },
                components: {
                  Tree: {
                    directoryNodeSelectedBg: 'rgba(22,119,255,0.2)',
                    directoryNodeSelectedColor: '',
                  },
                },
              }}
            >
              <DirectoryTree
                showLine={true}
                showIcon={true}
                blockNode={true}
                defaultExpandedKeys={[]}
                titleRender={(nodeData) => { return <ContextMenuDemo node={nodeData}></ContextMenuDemo> }}
                onSelect={onSelect}
                treeData={treeData}
              />
            </ConfigProvider>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80} minSize={50} onResize={(e) => { setRightSize(e) }}>
        <ResizablePanelGroup direction="vertical" onLayout={(e) => {
          setRightTopSize(e[0])
          setRightBottomSize(e[1])
        }}>
          <ResizablePanel defaultSize={70} minSize={20} className="after:w-0">
            <div>
              <ScrollArea className="whitespace-nowrap border-b" style={{ width: `${containerSize.width * (rightSize / 100)}px` }}>
                <div className="flex">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((artwork) => (
                    <figure key={artwork}>
                      <figcaption className="w-[200px] border-r flex items-center justify-between pl-2 pr-2 h-9 text-sm hover:bg-accent hover:text-accent-foreground border-t"
                        style={{ borderTopColor: artwork == 1 ? 'rgba(22,119,255,1)' : 'transparent' }}>
                        <div>console_{artwork}</div>
                        <Cross2Icon className="w-4 h-4" />
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <div className="border-b flex items-center h-9 pl-2">
              <Button variant="ghost" size="icon" className="w-7 h-7 mr-2">
                <PlayIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 mr-2">
                <StopIcon className="h-4 w-4" />
              </Button>
              {/* <p>Width: {containerSize.width}px, Height: {containerSize.height}px, Size: {rightSize}, Size Width: {containerSize.width * (rightSize / 100)}</p> */}
            </div>
            <div className="" style={{ height: `calc(100vh * ${rightTopSize / 100} - 5rem)` }}>
              {/* <MonacoEditor
                id="study"
                // ref={editorRef as any}
                defaultValue={'11111\n6666666\n\nselect * from aaa;'}
                language={'sql'}
                marks={[]}
                onSave={() => { }}
                onChange={() => { }}
                selectedWord={() => { }}
                isActive={true}
                fontSize={14}
                lineNumbers={true}
                onUpdateMark={() => { }}
              /> */}
              <Code language="sql" code={"\nselect * from mysql.test.test_table\n\n\n\n\n\n\n"}></Code>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30} minSize={10}>
            <div>
              <ScrollArea className="whitespace-nowrap border-b" style={{ width: `${containerSize.width * (rightSize / 100)}px` }}>
                <div className="flex">
                  <figure>
                    <figcaption className="h-8 border-r flex items-center pl-2 pr-2 text-sm hover:bg-accent hover:text-accent-foreground">
                      <div>Output</div>
                    </figcaption>
                  </figure>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((artwork) => (
                    <figure key={artwork}>
                      <figcaption className="h-8 border-r flex items-center justify-between pl-2 pr-2 text-sm hover:bg-accent hover:text-accent-foreground border-b"
                        style={{ borderBottomColor: artwork == 1 ? 'rgba(22,119,255,1)' : 'transparent' }}>
                        <div>table-{artwork}</div>
                        <Cross2Icon className="w-4 h-4 ml-2" />
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <div className="border-b h-8 pl-1 flex">
              <div className="border-r flex items-center pr-1 pl-1">
                <Button variant="ghost" size="icon" className="w-7 h-7">
                  <DoubleArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <div className="flex">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="h-7 hover:bg-accent hover:text-accent-foreground rounded-md text-xs inline-flex items-center pl-2 pr-1">
                        <div>1-500</div>
                        <ChevronDownIcon className="h-4 w-4" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-50">
                      <DropdownMenuLabel>Page Size</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem>100</DropdownMenuItem>
                        <DropdownMenuItem>500</DropdownMenuItem>
                        <DropdownMenuItem>All</DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Change Default: 500</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="h-7 hover:bg-accent hover:text-accent-foreground rounded-md text-xs inline-flex items-center pl-1 pr-2">of 501+</div>
                </div>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="border-r flex items-center pl-1 pr-1">
                <Button variant="ghost" size="icon" className="w-7 h-7">
                  <UpdateIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                  <StopIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="" style={{ height: `calc(100vh * ${rightBottomSize / 100} - 5rem)` }}>
              {/* <Code language="sql" code={"11111"}></Code> */}
              <Table className="">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableCell key={header.id} className="border-r py-[3px] px-1">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className=""
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="border-r p-1">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>)
}
