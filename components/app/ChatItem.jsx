// React
import { useEffect, useMemo, useRef, useState } from "react";
// NextJS
import Image from "next/image";
import { useRouter } from "next/router";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions'
// Components
import AppUserStatus from "./UserStatus";

function AppChatItem({ state, actions, props }) {

    const router = useRouter();

    const [ status, setStatus ] = useState(props.chat.status);
    const [ unreadMessages, setUnreadMessages ] = useState(props.unreadMessages);
    const [ username, setUsername ] = useState(props.chat.username);
    const [ profilePhoto, setProfilePhoto ] = useState(props.chat.profilePhoto);

    const xmark = useRef(null);
    const handleShowTimes = () => {
        xmark.current.style.display = 'block';
    }

    const handleHideTimes = () => {
        xmark.current.style.display = 'none';
    }

    const handleDeleteChat = () => {
        actions.hideChat(props.chatId, onDeleteChatRedirect);
    }

    const onDeleteChatRedirect = () => {
        if(router.pathname === '/app/chat' && props.chatId === state.chat.selectedChat) {
            router.push('/app/friends')
        }
    }

    return(
        <div className="flex items-center justify-between w-full py-2 pl-3 pr-2 rounded-md cursor-pointer app-friends-user transition-colors relative" onMouseEnter={handleShowTimes} onMouseLeave={handleHideTimes}>
            <div className="flex items-center gap-3 hover:text-zinc-300">
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
            <div id="xmarkContainer" className="hidden absolute z-10 right-3" onClick={handleDeleteChat} ref={xmark} >
                <i id="xmark" className="fa-regular fa-xmark hover:text-zinc-300 px-1"></i>
            </div>
        </div>
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
)(AppChatItem);