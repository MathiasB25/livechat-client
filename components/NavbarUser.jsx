// NextJS
import Image from "next/image";
import Link from "next/link";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../redux/actions'
import { useRef, useState } from "react";
// Hooks
import useClickOutSide from "../hooks/useClickOutSide";

function NavbarUser({state, actions}) {
    
    const auth = state.auth;

    const menu = useRef(null);
    
    const [ menuActive, setMenuActive ] = useState(false);
    const [ menuAnim, setMenuAnim ] = useState(false);
    
    const handleMenu = () => {
        setMenuActive(true);
        if(menuActive) {
            setMenuAnim(true);
            setTimeout(() => {
                setMenuAnim(false);
                setMenuActive(false);
            }, 170)
        }
    }
    useClickOutSide(menu, handleMenu)
    
    const handleLogout = () => {
        actions.authLogout();
    }
 
    return(
        auth.username ? (
            <div className="relative select-none">
                <div className="flex gap-2 items-center justify-between bg-white px-2 pr-5 py-1 rounded-xl cursor-pointer" onClick={handleMenu}>
                    { auth.profilePhoto ? (
                        <Image src={auth.profilePhoto} width={"40"} height={"40"} className="rounded-full w-10 h-10" alt="User profile photo" />
                    ) : (
                        <div className="flex items-center w-10 h-10 text-4xl text-zinc-300">
                            <i className="fa-solid fa-circle-user"></i>
                        </div>
                    )}
                    <div>{auth.username}</div>
                </div>
                { menuActive && (
                    <div ref={menu} className={`absolute right-0 top-14 flex flex-col gap-2 bg-white p-3 rounded-md w-60 z-10 ${menuAnim ? 'from-top-anim-close' : 'from-top-anim'}`}>
                        <Link href={"/app"}>
                            <div className="w-full py-3 px-5 hover:bg-violet-500 hover:text-white transition-colors rounded-md cursor-pointer">Ir a la app</div>
                        </Link>
                        <div className="w-full bg-zinc-200" style={{height: '1px'}}></div>
                        <Link href={'#'}>
                            <div className="w-full py-3 px-5 hover:bg-violet-500 hover:text-white transition-colors rounded-md cursor-pointer">Mi cuenta</div>
                        </Link>
                        <div className="w-full bg-zinc-200" style={{height: '1px'}}></div>
                        <div className="w-full py-3 px-5 hover:bg-violet-500 hover:text-white transition-colors rounded-md cursor-pointer" onClick={handleLogout}>Cerrar sesión</div>
                    </div>
                )}
            </div>
        ) : (
            <div>
                <Link href={'/register'}>
                    <button className="px-5 py-2 rounded-full bg-white hover:bg-black hover:text-white transition-colors">Unirme a LiveChat</button>
                </Link>
            </div>
        )
    )
} 

const mapStateToProps = (state) => ({
	state: state
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavbarUser);