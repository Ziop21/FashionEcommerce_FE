

import Link from "next/link";
import Container from "../Container";
import { Redressed } from "next/font/google";
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import SearchBar from "./Search";

const redressed = Redressed({subsets: ['latin'], weight: ["400"]});

const NavBar = () => {
    return (
    <div className=" sticky top-0 w-full bg-slate-200 z-30 shadow-se">
        <div className="py-4 border-b-[1px]">
            <Container> 
                <div className="flex items-center justify-between gap-3 md:gap-0">
                <Link href="/" className={`${redressed.className} font-bold text-2xl`}>E-Shop</Link>
                <Link href="/filter" className={'font-bold text-2xl'}>VIEW ALL PRODUCTS</Link>
                <SearchBar className="hidden md:block border-sm border-slate-500 border-1 rounded-lg"></SearchBar>
                <div className="flex items-center gap-8 md:gap-12">
                    <CartCount />
                    <UserMenu />
                </div>
                </div>
            </Container>
        </div> 
    </div>
    )
}
 
export default NavBar;  