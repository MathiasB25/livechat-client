// React
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
// NextJS
import Image from "next/image";
import { useRouter } from "next/router";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions'
// Components
import AppChatItem from "./ChatItem";
import AppUserStatus from "./UserStatus";
import Modal from "../Modal";
import ContextMenu from "../ContextMenu";
import Settings from "./settings/Settings";
// Hooks
import randomId from "../../hooks/randomId";
// moment
import moment from "moment";
import useClickOutSide from "../../hooks/useClickOutSide";
import useSocket from "../../hooks/useSocket";

function AppFriends({ state, actions }) {

    const router = useRouter();

    const { updateStatus } = useSocket();

    const { auth } = state;
    const chats = state.chat.chats;
    const [ selectedChat, setSelectedChat ] = useState(null);

    const handleSelectedChat = (user, chatId) => {
        if(!chatId) {
            state.chat.chats.filter( mapChat => {
                mapChat.users.map( userMap => {
                    if(userMap._id === user._id) {
                        chatId = mapChat._id;
                    }
                })
            })
        }
        if(chatId === selectedChat) {
            return
        }
        setSelectedChat(chatId);
        actions.setSelectedChat(user, chatId)
        router.push('/app/chat')
    }

    const handleCopyUsername = (username) => {
        navigator.clipboard.writeText(username);
    }

    const [ selectedFriend, setSelectedFriend ] = useState({});

    // Remove friend modal
    const [ showModal, setShowModal ] = useState(false);
    const [ closeModal, setCloseModal ] = useState(false);

    const handleShowModal = () => {
        setShowModal(!showModal);
    }

    // User profile modal
    const [ showProfileModal, setShowProfileModal ] = useState(false);
    const [ closeProfileModal, setCloseProfileModal ] = useState(false);

    const handleShowProfileModal = (friend) => {
        if(!showProfileModal) {
            setSelectedFriend(friend);
        } else {
            setSelectedFriend({});
        }
        setShowProfileModal(!showProfileModal);
    }

    // ContextMenu
    const [ clicked, setClicked ] = useState(false);
    const [ points, setPoints ] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleClick = () => setClicked(false);
        window.addEventListener("click", handleClick);
        return () => {
          window.removeEventListener("click", handleClick);
        };
    }, []);

    const blockFriend = (userId) => {
        actions.blockFriend(userId);
    }

    const unblockFriend = (userId) => {
        actions.unblockFriend(userId);
    }

    const removeFriend = (userId) => {
        actions.removeFriend(userId);
    }

    // Settings
    const [ showSettings, setShowSettings ] = useState(false);

    const handleShowSettings = () => {
        setShowSettings(!showSettings);
    }

    const profileCard = useRef(null);
    const [ showProfileCard, setShowProfileCard ] = useState(false);
    const [ profileCardAnim, setProfileCardAnim ] = useState(false);
    const [ showProfileCardStatus, setShowProfileCardStatus ] = useState(false);
    
    const handleShowProfileCard = () => {
        if(showProfileCard) {
            setProfileCardAnim(true);
            setTimeout(() => {
                setShowProfileCard(false);
                setProfileCardAnim(false);
            }, 170)
        } else {
            setShowProfileCard(true);
        }
    }

    const handleProfileStatusHover = () => {
        setShowProfileCardStatus(true);
    }
    
    const handleProfileStatusLeave = () => {
        setShowProfileCardStatus(false)
    }

    const handleCloseProfileCard = () => {
        if(!showProfileCard) {
            return
        }
        setProfileCardAnim(true);
        setTimeout(() => {
            setShowProfileCard(false);
            setProfileCardAnim(false);
        }, 170)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileCard?.current && !profileCard?.current.contains(event.target)) {
                handleCloseProfileCard()
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
              document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileCard, showProfileCard]);

    const handleChangeStatus = (status) => {
        if(status !== auth.status) {
            actions.updateUserStatus(status);
            updateStatus({ _id: auth._id, username: auth.username, tag: auth.tag, profilePhoto: auth.profilePhoto, status, bannerColor: auth.bannerColor })
        }
        setProfileCardAnim(true);
        setTimeout(() => {
            setShowProfileCard(false);
            setProfileCardAnim(false);
            setShowProfileCardStatus(false);
        }, 170)
    } 
    
    return(
        <div className="text-lg flex flex-col justify-between bg-app-7" style={{width: '300px'}}>
            <div className="flex flex-col gap-5 p-3 overflow-y-scroll invisible-scrollbar" style={{height: 'calc(100vh - 4.3rem)'}}>
                <div className="">
                    <Link href={"/app/friends"}>
                        <div className="flex items-center gap-3 hover:bg-app-3 transition-colors w-full text-left py-3 px-3 rounded-md hover:text-zinc-300 cursor-pointer">
                            <div><i className="text-xl fa-solid fa-user-group"></i></div>
                            <div>Amigos</div>
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-3 hover:text-zinc-300">
                        <div>Chats</div>
                        <button className=""><i className="fa-solid fa-plus"></i></button>
                    </div>
                    <div className="flex flex-col gap-1">
                        { chats.length != 0 ? chats.map( chat => (
                            <div key={randomId()} onClick={() => handleSelectedChat(chat.users.filter( user => user._id != auth._id )[0], chat._id)} onContextMenu={(e) => {
                                setClicked(true);
                                setSelectedFriend( chat.users.filter( user => user._id != auth._id )[0] );
                                setPoints({
                                x: e.pageX,
                                y: e.pageY,
                                });
                            }}>
                                <AppChatItem props={{ chat: chat.users.filter( user => user._id != auth._id )[0], unreadMessages: chat.lastMessages, auth: state.auth }} />
                            </div>
                        )) : (
                            <div className="text-center pt-4">Aún no tienes chats</div>
                        )}
                    </div>
                </div>
            </div>
            <div ref={profileCard} className="relative">
                <div className="flex items-center justify-between w-full text-left px-2 bg-app-3" style={{height: '4.3rem'}} onClick={handleShowProfileCard}>
                    <div className="flex items-center gap-3 px-2 h-14 hover:bg-app-0 cursor-pointer rounded-md transition-colors friends-me-hover friend-hover" onClick={() => handleCopyUsername(`${auth.username}#${auth.tag}`)}>
                        <div className="relative">
                            { auth.profilePhoto ? (
                                <img src={auth.profilePhoto} className="rounded-full w-10 h-10" alt="User profile photo" />
                            ) : (
                                <div className="flex items-center justify-center w-10 h-10 bg-neutral-700 rounded-full cursor-pointer text-2xl friend-bg transition-colors">
                                    <div>{auth.username.slice(0, 1)}</div>
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-app-3 p-1 rounded-full app-friends-status transition-colors">
                                <AppUserStatus status={auth.status} size="10" />
                            </div>
                        </div>
                        <div className="flex flex-col overflow-hidden" style={{maxWidth: '6.1rem'}}>
                            <div className="friends-me-name">{auth.username}</div>
                            <div className="friends-me-tag text-sm -mt-1">#{auth.tag}</div>
                        </div>
                    </div>
                    <div className="flex items-center text-xl">
                        <button className="w-10 h-10 hover:bg-app-0 transition-colors rounded-md"><i className="fa-solid fa-microphone mt-2"></i></button>
                        <button className="w-10 h-10 hover:bg-app-0 transition-colors rounded-md"><i className="fa-solid fa-headphones mt-2"></i></button>
                        <button className="w-10 h-10 hover:bg-app-0 transition-colors rounded-md" onClick={handleShowSettings}><i className="fa-solid fa-gear mt-2"></i></button>
                    </div>
                </div>
                { showProfileCard && (
                    <div className={`fixed left-2 bottom-20 bg-app-2 rounded-lg ${profileCardAnim ? 'opacity-anim-close' : 'opacity-anim'}`}>
                        <div className="rounded-t-lg" style={{width: '23rem', minHeight: '5rem', backgroundColor: auth.bannerColor}}></div>
                        <div className="relative bg-app-2 rounded-b-lg p-4 pt-0">
                            <div className="absolute left-4 rounded-full" style={{top: '-3.6rem'}}>
                                <div className="relative">
                                    {auth?.profilePhoto ? (
                                        <img src={auth?.profilePhoto} width={40} height={40} className="absolute top-2 left-2 w-24 h-24 rounded-full" alt="User profile photo" style={{zIndex: '5'}} />
                                    ) : (
                                        <div className="flex items-center justify-center w-24 h-24 bg-app-5 rounded-full text-5xl absolute top-2 left-2" style={{zIndex: '5'}}>
                                            <div>{auth?.username?.slice(0, 1)}</div>
                                        </div>
                                    )}
                                    <div className="absolute top-[.065rem] left-[.065rem] w-[6.9rem] h-[6.9rem] bg-app-1 rounded-full" style={{zIndex: '1'}}></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 py-8"></div>
                            <div className="flex flex-col bg-app-7 p-3 px-3 rounded-lg">
                                <div className="flex flex-col gap-5 px-1 pb-1">
                                    <div className="flex items-end text-2xl font-semibold select-text">
                                        <div className="text-zinc-200">{auth?.username}</div>
                                        <div>{`#${auth?.tag}`}</div>
                                    </div>
                                    <div className="flex flex-col gap-1 text-base">
                                        <div className="uppercase text-zinc-200 font-semibold">Miembro de LiveChat desde</div>
                                        <div>{moment(auth?.createdAt).format('ll')}</div>
                                    </div>
                                </div>
                                <div className="bg-app-2 my-2 mx-1" style={{height: '1px'}}></div>
                                <div className="relative py-2 px-4 hover:bg-app-0 rounded-md transition-colors cursor-pointer" onMouseEnter={handleProfileStatusHover} onMouseLeave={handleProfileStatusLeave}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${auth.status === 'online' ? 'bg-green-700' : auth.status === 'away' ? 'bg-yellow-600' : auth.status === 'invisible' ? 'bg-zinc-400' : auth.status === 'occupied' ? 'bg-red-500' : auth.status === 'offline' && 'bg-zinc-400'}`}></div>
                                            <div>{auth.status === 'online' ? 'En línea' : auth.status === 'away' ? 'Inactivo' : auth.status === 'invisible' ? 'Invisible' : auth.status === 'occupied' ? 'No molestar' : auth.status === 'offline' && 'Desconectado'}</div>
                                        </div>
                                        <div className="text-sm"><i className="fa-solid fa-chevron-right"></i></div>
                                    </div>
                                    { showProfileCardStatus && (
                                        <div className="absolute -top-32 left-[18.2rem] pl-10">
                                            <div className="bg-app-7 py-2 px-2 rounded-md" style={{width: '20rem'}}>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 py-2 px-3 hover:bg-app-2 transition-colors rounded" onClick={() =>  handleChangeStatus('online')}>
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <div>En línea</div>
                                                    </div>
                                                    <div className="bg-app-2 my-2" style={{height: '1px'}}></div>
                                                    <div className="flex items-center gap-2 py-2 px-3 hover:bg-app-2 transition-colors rounded" onClick={() =>  handleChangeStatus('away')}>
                                                        <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                                                        <div>Inactivo</div>
                                                    </div>
                                                    <div className="flex items-start gap-2 py-2 px-3 hover:bg-app-2 transition-colors rounded" onClick={() =>  handleChangeStatus('occupied')}>
                                                        <div className="mt-2 w-3 h-3 bg-red-500 rounded-full"></div>
                                                        <div className="flex flex-col">
                                                            <div>No molestar</div>
                                                            <div className="text-[0.92rem] leading-[1.25rem]">No recibes notificaciones.</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2 py-2 px-3 hover:bg-app-2 transition-colors rounded" onClick={() =>  handleChangeStatus('invisible')}>
                                                        <div className="mt-2 w-3 h-3 bg-zinc-400 rounded-full"></div>
                                                        <div className="flex flex-col" style={{width: 'calc(100% - 0.75rem)'}}>
                                                            <div>Invisible</div>
                                                            <div className="text-[0.92rem] leading-[1.25rem]">Te veras como desconectado, pero seguiras teniendo acceso total.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            { clicked && (
                <ContextMenu top={`${points.y}px`} left={`${points.x}px`}>
                    <div className="text-base flex flex-col p-3 bg-app-8 rounded-md" style={{width: '13rem'}}>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"} onClick={() => handleShowProfileModal(selectedFriend)}>Ver perfil</div>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"} onClick={(e) => handleSelectedChat(selectedFriend, null)}>Enviar mensaje</div>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"}>Llamar</div>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"} onClick={(e) => selectedFriend.blocked ? unblockFriend(selectedFriend._id) : blockFriend(selectedFriend._id)}>{ selectedFriend.blocked ? 'Desbloquear' : 'Bloquear' }</div>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"} id="removeFriend" onClick={handleShowModal}>Eliminar amigo</div>
                    </div>
                </ContextMenu>
            )}
            { showProfileModal && (
                <Modal setter={setShowProfileModal} close={{ state: closeProfileModal, setter: setCloseProfileModal }}>
                    <div className="bg-app-2 rounded-lg" style={{width: '37rem'}}>
                        <div className="rounded-t-lg" style={{minHeight: '8rem', backgroundColor: `${selectedFriend.bannerColor}`}}></div>
                        <div className="relative bg-app-1 rounded-b-lg p-4 pt-0">
                            <div className="absolute left-4 rounded-full" style={{top: '-4rem'}}>
                                <div className="relative">
                                    {selectedFriend.profilePhoto ? (
                                        <img src={selectedFriend.profilePhoto} className="absolute top-2 left-2 w-28 h-28 rounded-full" alt="User profile photo" style={{zIndex: '10'}} />
                                    ) : (
                                        <div className="flex items-center justify-center w-28 h-28 bg-app-5 rounded-full text-5xl absolute top-2 left-2" style={{zIndex: '10'}}>
                                            <div>{selectedFriend.username.slice(0, 1)}</div>
                                        </div>
                                    )}
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-app-1 rounded-full" style={{zIndex: '5'}}></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 py-5">
                                <div className="py-2 px-4 bg-violet-500 hover:bg-violet-800 text-zinc-100 rounded-md cursor-pointer transition-colors" id="friend" onClick={(e) => handleSelectedChat(selectedFriend, null)}>Enviar mensaje</div>
                            </div>
                            <div className="flex flex-col gap-5 bg-app-5 p-3 rounded-lg">
                                <div className="flex items-end text-xl font-semibold select-text">
                                    <div className="text-zinc-200">{selectedFriend.username}</div>
                                    <div>{`#${selectedFriend.tag}`}</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="uppercase text-zinc-200 font-semibold">Miembro de LiveChat desde</div>
                                    <div>{moment(selectedFriend.createdAt).format('ll')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            { showModal && (
                <Modal setter={setShowModal} close={{ state: closeModal, setter: setCloseModal }}>
                    <div className="bg-app-2 rounded" style={{width: '27rem'}}>
                        <div className="flex flex-col gap-3 pt-4 pb-6 px-5">
                            <div className="text-zinc-300 text-xl">Eliminar a '{selectedFriend.username}'</div>
                            <div className="">Estás seguro que deseas eliminar a <span className="text-zinc-300">{selectedFriend.username}</span> de tus amigos?</div>
                        </div>
                        <div className="bg-app-4 rounded-b p-3">
                            <div className="flex gap-5 justify-end">
                                <button className="text-zinc-300 hover:underline" onClick={() => setCloseModal(true)}>Cancelar</button>
                                <button className="py-2 px-3 text-zinc-300 bg-red-700 rounded" onClick={() => {setCloseModal(true), removeFriend(selectedFriend._id);}}>Eliminar amigo</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            { showSettings && (
                <Settings close={handleShowSettings} />
            )}
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
)(AppFriends);