import { useEffect, useRef, useState } from "react"

export default function ToolTip({children, text}) {
    
    const element = useRef(null);
    const tooltip = useRef(null);

    const [ childrenPosition, setChildrenPosition ] = useState({l: 0, r: 0, t: 0});
    const [ childrenDimension, setChildrenDimension ] = useState({ w: 0, h: 0 });
    const [ toolTipWidth, setToolTipWidth ] = useState(0);
    const [ isHover, setIsHover ] = useState(false);

    const handleChangeHover = () => {
        setIsHover(!isHover)
    }

    useEffect(() => {
        setToolTipWidth(tooltip.current.offsetWidth);
        setChildrenDimension({ w: element.current.offsetWidth, h: element.current.offsetHeight });
        const elem = element.current.getBoundingClientRect(); 
        setChildrenPosition({ l: elem.left, r: elem.right, t: elem.top });
    }, [isHover])

    return(
        <div className="">
            <div ref={tooltip} className={`${isHover ? 'block opacity-anim' : 'hidden'} pointer-events-none absolute whitespace-nowrap py-2 px-3 rounded-md bg-app-8`} style={{top: `${(childrenPosition.t - childrenDimension.h) - 10}px`, left: `${childrenPosition.l - ((toolTipWidth / 2) - (childrenDimension.w / 2))}px`}}>
                <div className="text-xl text-app-8 absolute left-1/2 -translate-x-1/2" style={{top: tooltip.current && (tooltip.current.offsetHeight - 10)}}><i className="fa-sharp fa-solid fa-caret-down"></i></div>
                <div>{text}</div>
            </div>
            <div ref={element} onMouseEnter={handleChangeHover} onMouseLeave={handleChangeHover}>{children}</div>
        </div>
    )
}