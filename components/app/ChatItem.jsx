// NextJS
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
// Components
import AppUserStatus from "./UserStatus";

export default function AppChatItem({props}) {

    const [ status, setStatus ] = useState(props.chat.status);
    const [ unreadMessages, setUnreadMessages ] = useState(props.unreadMessages);
    const [ username, setUsername ] = useState(props.chat.username);
    const [ profilePhoto, setProfilePhoto ] = useState(props.chat.profilePhoto);

    return(
        <div className="flex items-center justify-between w-full py-2 px-3 rounded-md hover:text-zinc-300 cursor-pointer app-friends-user transition-colors">
            <div className="flex items-center gap-3 text-left">
                <div className="relative pointer-events-none text-zinc-400">
                    {profilePhoto ? (
                        <img src={profilePhoto} className="rounded-full w-9 h-9" alt="User profile photo" />
                    ) : (
                        <div className="flex items-center justify-center w-9 h-9 bg-app-0 rounded-full cursor-pointer text-2xl">
                            <div className="">{username.slice(0, 1)}</div>
                        </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-app-7 p-1 rounded-full app-friends-status transition-colors">
                        <AppUserStatus status={status} size="10" />
                    </div>
                </div>
                <div>{username}</div>
            </div>
            { unreadMessages && unreadMessages?.from !== props.auth._id && unreadMessages?.messages?.length !== 0 && (
                <div className="grid place-items-center text-white text-sm bg-violet-500 w-5 h-5 rounded-full">
                    <div className="relative top-[.01rem] text-[.75rem] font-extrabold">{unreadMessages?.messages?.length}</div>
                </div>
            )}
        </div>
    )
}