'use client'


import Link from "next/link";
import AdminNavItem from "./AdminNavItem";
import { MdDashboard, MdLibraryAdd } from "react-icons/md";
import { usePathname } from "next/navigation";
import Container from "../Container";
import { Button } from "@mui/material";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

const AdminNav = () => {
    const pathname = usePathname()
    return (
        <div className="w-full shadow-sm top-20 border-b-[1px] pt-4">
            <Container>
                <div className="flex flex-row items-center justify-between
                md:justify-center gap-8 md:gap-12 overflow-x-auto flex-nowrap
                ">
                    <Link href='/admin'>
                        <AdminNavItem
                            label="Summary"
                            icon={MdDashboard}
                            selected={pathname?.includes("/admin ")}
                        />
                    </Link>
                    <Link href='/admin/product'>
                        <AdminNavItem
                            label="Manage Products"
                            icon={MdDashboard}
                            selected={pathname?.includes("/admin/product")}
                        />
                    </Link>
                    <Link href='/admin/stock' >
                        <AdminNavItem
                            label="Manage Stocks"
                            icon={MdDashboard}
                            selected={pathname?.includes("/admin/stock")}
                        />
                    </Link>
                    <Link href='/admin/order'>
                        <AdminNavItem
                            label="Manage Orders"
                            icon={MdDashboard}
                            selected={pathname?.includes("/admin/order")}
                        />
                    </Link>
                    <Popover placement="bottom" showArrow={false}>
                        <PopoverTrigger>
                            <Button>More</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="flex flex-col">
                                <Link href='/admin/category' >
                                    <AdminNavItem
                                        label="Manage Categories"
                                        icon={MdDashboard}
                                        selected={pathname?.includes("/admin/category ")}
                                    />
                                </Link>
                                <Link href='/admin/category-product' className="w-full">
                                    <AdminNavItem
                                        label="Manage Category Product"
                                        icon={MdDashboard}
                                        selected={pathname?.includes("/admin/category-product")}
                                    />
                                </Link>
                                <Link href='/admin/color' className="w-full">
                                    <AdminNavItem
                                        label="Manage Colors"
                                        icon={MdDashboard}
                                        selected={pathname?.includes("/admin/color")}
                                    />
                                </Link>
                                <Link href='/admin/size' className="w-full">
                                    <AdminNavItem
                                        label="Manage Sizes"
                                        icon={MdDashboard}
                                        selected={pathname?.includes("/admin/size")}
                                    />
                                </Link>
                                <Link href='/admin/user-level' className="w-full">
                                    <AdminNavItem
                                        label="Manage User Level"
                                        icon={MdDashboard}
                                        selected={pathname?.includes("/admin/user-level")}
                                    />
                                </Link>
                                <Link href='/admin/user' className="w-full">
                                    <AdminNavItem
                                        label="Manage User"
                                        icon={MdDashboard}
                                        selected={pathname?.includes("/admin/user ")}
                                    />
                                </Link>
                                <Link href='/admin/stock-diary' className="w-full">
                                    <AdminNavItem
                                        label="Manage Stock Diary"
                                        icon={MdDashboard}
                                        selected={pathname?.includes("/admin/stock-diary")}
                                    />
                                </Link>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </Container>
        </div>
    );
}

export default AdminNav;