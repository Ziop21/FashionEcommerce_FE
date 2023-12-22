'use client'

import { useCallback, useEffect, useState } from "react";
import Avatar from "../Avata";
import { AiFillCaretDown } from "react-icons/ai";
import Link from "next/link";
import MenuItem from "./MenuItem";
import BackDrop from "./BackDrop";
import Logout from "@/pages/api/guest/auth/logout/[...nextauth]";
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation";
import { getCurrentUserRoles } from "@/server/handler/AuthorizationHanlder";
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME, JWT_REFRESH_COOKIE_NAME } from "@/config/ApplicationConfig";
import AuthenJwtDecoder from "@/utils/AuthenJwtDecoder";
import { verifyExpirationJwt } from "@/server/handler/AuthenticationHandler";

const UserMenu = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState<Boolean>(false);
    const [isCustomer, setIsCustomer] = useState<Boolean>(false);
    const [isAuthen, setIsAuthen] = useState(false);

    useEffect(() => {
        const setAuthorInfo = async () => {
            const jwt = Cookies.get(JWT_COOKIE_NAME)
            if (jwt) {
                setIsAuthen(true);
                const roles = await getCurrentUserRoles(jwt);
                if (Array.isArray(roles)) {
                    if (roles.includes("ADMIN"))
                        setIsAdmin(true);
                    if (roles.includes("CUSTOMER"))
                        setIsCustomer(true);
                }
            }
        }
        setAuthorInfo();

    }, [Cookies.get(JWT_COOKIE_NAME)])

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    const handleLogoutButtonClick = async () => {
        const response = await Logout();
        Cookies.remove(JWT_COOKIE_NAME)
        Cookies.remove(JWT_REFRESH_COOKIE_NAME)
        setIsAuthen(false);
        setIsAdmin(false);
        toast.success("Logout successfully...");
        router.push('/login');
    }

    return (
        <>
            <div className="relative z-30">
                <div onClick={toggleOpen} className="
            p-2
            border-[1px]
            border-slate-400
            flex
            flex-row
            items-center gap-1 rounded-full
            cursor-pointer hover:shadow-md transition text-slate-700
            ">
                    <Avatar />
                    <AiFillCaretDown />
                </div>
                {isOpen && (
                    <div className="
                absolute rounded-md shadow-md w-[170px] bg-white
                overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer
                ">
                        <div>
                            {isCustomer && (
                                <Link href="/customer/profile">
                                    <MenuItem onClick={toggleOpen}>Profile</MenuItem>
                                </Link>
                            )}
                            {isCustomer && (
                                <Link href="/customer/order">
                                    <MenuItem onClick={toggleOpen}>Your Order</MenuItem>
                                </Link>
                            )}
                            {isCustomer && (
                                <Link href="/customer/follow">
                                    <MenuItem onClick={toggleOpen}>Followed products</MenuItem>
                                </Link>
                            )}
                            {isAdmin && (
                                <Link href="/admin">
                                    <MenuItem onClick={toggleOpen}>Admin Dashboard</MenuItem>
                                </Link>
                            )}
                            {isAuthen && (
                                <MenuItem onClick={handleLogoutButtonClick}>Log out</MenuItem>
                            )}
                        </div>
                        <div>
                            {!isAuthen && (
                                <><Link href="/login">
                                    <MenuItem onClick={toggleOpen}>Login</MenuItem>
                                </Link><Link href="/register">
                                        <MenuItem onClick={toggleOpen}>Register</MenuItem>
                                    </Link></>
                            )}

                        </div>
                    </div>
                )}
            </div>
            {isOpen ? <BackDrop onClick={toggleOpen} /> : null}
        </>
    )
}

export default UserMenu;