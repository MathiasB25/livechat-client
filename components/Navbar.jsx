import Link from "next/link";
import NavbarUser from "./NavbarUser";

export default function Navbar() {
    return(
        <div className={`flex items-center justify-between px-20 h-20 bg-violet-500`}>
            <Link href={"/"}>
                <div className="flex items-center gap-2 text-white hover:scale-105 transition-all">
                    <div className="text-2xl"><i className="fa-solid fa-message-smile"></i></div>
                    <div className="text-xl font-medium">LiveChat</div>
                </div>
            </Link>
            <NavbarUser />
        </div>
    )
}