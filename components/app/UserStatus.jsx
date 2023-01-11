import { useEffect, useState } from "react";

export default function AppUserStatus({status, size}) {

    const [ color, setColor ] = useState(status === 'online' ? 'bg-green-700' : status === 'away' ? 'bg-yellow-600' : status === 'invisible' ? 'bg-zinc-400' : status === 'occupied' ? 'bg-red-500' : status === 'offline' && 'bg-zinc-400');

    useEffect(() => {
        const newColor = status === 'online' ? 'bg-green-700' : status === 'away' ? 'bg-yellow-600' : status === 'invisible' ? 'bg-zinc-400' : status === 'occupied' ? 'bg-red-500' : status === 'offline' && 'bg-zinc-400';
        if(newColor != color) {
            setColor(newColor);
        }
    }, [status])
    
    return(
        <div className={`${color ? color : null} rounded-full`} style={{width: size ? `${size}px` : '12px', height: size ? `${size}px` : '12px'}}></div>
    )
}