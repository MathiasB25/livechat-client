import { useEffect, useRef, useState } from "react";
import useClickOutSide from "../hooks/useClickOutSide";

export default function Modal({ children, setter, close }) {

    const [ closeAnim, setCloseAnim ] = useState(false);

    useEffect(() => {
        if(close.state) {
            setCloseAnim(true);
            setTimeout(() => {
                setter(false);
            }, 170)
            close.setter(false);
        }
    }, [close.state])

    const handleCloseModal = () => {
        setCloseAnim(true);
        setTimeout(() => {
            setter(false);
        }, 170)
    }

    return(
        <div className={`${closeAnim ? 'opacity-anim-close' : 'opacity-anim'} z-20`}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                {children}
            </div>
            <div className="absolute top-0 left-0 w-screen h-screen bg-black opacity-40 z-40" onClick={handleCloseModal}></div>
        </div>
    )
}