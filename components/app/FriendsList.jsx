// NextJS
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions'
// Components
import ToolTip from "../ToolTip";
import AppUserStatus from "./UserStatus";
// Hooks
import randomId from "../../hooks/randomId";
import Modal from "../Modal";
import ContextMenu from "../ContextMenu";
import moment from "moment/moment";
import useClickOutSide from "../../hooks/useClickOutSide";

function AppFriendsList({ state, actions, filterBy }) {

    const router = useRouter();

    const auth = state.auth;
    const friends = auth.friends;
    const pendingRequests = auth.pendingRequests;
    
    const [ selectedFriend, setSelectedFriend ] = useState({});
    const [ filteredFriends, setFilteredFriends ] = useState([])

    useEffect(() => {
        if(friends.length != 0) {
            switch (filterBy) {
                case "online":
                    const online = friends.filter( friend => friend.status === 'online' || friend.status === 'away' || friend.status === 'occupied' );
                    setFilteredFriends(online);
                    break;
                case "all":
                    const all = friends.filter( friend => friend.blocked === false );
                    setFilteredFriends(all);
                    break;
                case "pending":
                    setFilteredFriends([]);
                    break;
                case "blocked":
                    const blocked = friends.filter( friend => friend.blocked === true );
                    setFilteredFriends(blocked);
                    break;
            }
        }
    }, [friends, filterBy])
    
    const [ showModal, setShowModal ] = useState(false);
    const [ closeModal, setCloseModal ] = useState(false);

    const handleShowModal = () => {
        setShowModal(!showModal);
        if(Object.keys(selectedFriend).length != 0) {
            setSelectedFriend({});
        }
    }

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

    const handleClickFriend = (e, friend) => {
        if(e.id === 'friend') {
            if(friend) {
                let chat = {};
                state.chat.chats.filter( mapChat => {
                    mapChat.users.map( user => {
                        if(user._id === friend._id) {
                            chat = mapChat;
                        }
                    })
                })
                actions.setSelectedChat(friend, chat ? chat._id : null);
            } else {
                let chat = {};
                state.chat.chats.filter( mapChat => {
                    mapChat.users.map( user => {
                        if(user._id === selectedFriend._id) {
                            chat = mapChat;
                        }
                    })
                })
                actions.setSelectedChat(selectedFriend);
            }
            router.push('/app/chat')
            return
        }
        if(e.id === 'removeFriend') {
            handleShowModal();
            setSelectedFriend(friend);
        }
    }

    const blockFriend = (userId) => {
        actions.blockFriend(userId);
    }
    
    const unblockFriend = (userId) => {
        actions.unblockFriend(userId);
    }

    const removeFriend = (userId) => {
        actions.removeFriend(userId);
    }

    const handleAcceptFriendRequest = (request) => {
        actions.acceptPendingRequest(request);
    }

    const handleDeleteFriendRequest = (request) => {
        actions.deletePendingRequest(request)
    }

    const filter = filterBy == 'online' ? 'En línea' : filterBy == 'all' ? 'Todos los amigos' : filterBy == 'pending' ? 'Pendientes' : 'Bloqueados';

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

    return(
        <div className="px-8 opacity-anim">
            <div className="flex flex-col gap-8 py-5 border-b border-app-3">
                <div className="flex items-center justify-between pr-4 bg-app-8 rounded-md cursor-text">
                    <input className="py-3 pl-4 placeholder:text-zinc-400 bg-transparent outline-none text-lg w-full" type="text" placeholder="Buscar" autoComplete="off" />
                    <div className="text-2xl pl-4">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div>{filter}</div>
                    <div><i className="fa-light fa-hyphen"></i></div>
                    <div>{filterBy != 'pending' ? filteredFriends.length : pendingRequests.length }</div>
                </div>
            </div>
            { friends.length != 0 && filterBy != 'pending' ? (
                <div className="flex flex-col">
                    {filteredFriends.map( friend => (
                        <div key={randomId()} className="border-b border-app-3">
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-app-0 transition-colors friend-hover cursor-pointer" id="friend" onClick={(e) => handleClickFriend(e.target, friend)} onContextMenu={(e) => {
                                setClicked(true);
                                setSelectedFriend(friend);
                                setPoints({
                                x: e.pageX,
                                y: e.pageY,
                                });
                            }}>
                                <div className="flex items-center gap-3 pointer-events-none">
                                    <div className="relative">
                                        {friend.profilePhoto ? (
                                            <img src={friend.profilePhoto} className="w-10 h-10 rounded-full" alt="User profile photo" />
                                        ) : (
                                            <div className="flex items-center justify-center w-10 h-10 bg-app-0 rounded-full cursor-pointer text-2xl friend-bg transition-colors">
                                                <div>{friend.username.slice(0, 1)}</div>
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 app-friends-status bg-app-7 p-1 rounded-full transition-colors">
                                            <AppUserStatus status={friend.status} size="10" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-end">
                                            <div className="text-xl text-zinc-300 font-medium">{friend.username}</div>
                                            <div className="friend-tag">#{friend.tag}</div>
                                        </div>
                                        <div style={{marginTop: '-5px'}}>{ friend.status === 'online' ? 'En línea' : friend.status === 'away' ? 'Inactivo' : friend.status === 'occupied' ? 'Ocupado' : 'Desconectado'}</div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pointer-events-none">
                                    <ToolTip text={"Enviar mensaje"}>
                                        <div className="flex items-center justify-center w-10 h-10 bg-app-0 transition-colors rounded-full friend-button hover:text-zinc-300"><i className="fa-solid fa-message"></i></div>
                                    </ToolTip>
                                    <ToolTip text={"Eliminar amigo"}>
                                        <div className="pointer-events-auto flex items-center justify-center w-10 h-10 bg-app-0 transition-colors rounded-full friend-button hover:text-red-800" id="removeFriend"><i className="pointer-events-none fa-solid fa-trash-can"></i></div>
                                    </ToolTip>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : pendingRequests.length != 0 && filterBy == 'pending' ? (
                pendingRequests.map( request => (
                    <div key={randomId()} className="flex justify-between p-3 rounded-lg hover:bg-app-0 transition-colors friend-hover cursor-pointer" onContextMenu={(e) => {
                        setClicked(true);
                        setSelectedFriend(request.from._id === auth._id ? request.to : request.from)
                        setPoints({
                          x: e.pageX,
                          y: e.pageY,
                        });
                    }}>
                        <div className="flex items-center gap-3">
                            { request.from._id === auth._id ? (
                                request.to.profilePhoto ? (
                                    <img src={request.to.profilePhoto} className="w-10 h-10 rounded-full" alt="User profile photo" />
                                ) : (
                                    <div className="flex items-center justify-center w-10 h-10 bg-app-0 rounded-full cursor-pointer text-2xl">
                                        <div>{request.to.username.slice(0, 1)}</div>
                                    </div>
                                )
                            ) : (
                                request.from.profilePhoto ? (
                                    <img src={request.from.profilePhoto} className="w-10 h-10 rounded-full" alt="User profile photo" />
                                ) : (
                                    <div className="flex items-center justify-center w-10 h-10 bg-app-0 rounded-full cursor-pointer text-2xl">
                                        <div>{request.from.username.slice(0, 1)}</div>
                                    </div>
                                )
                            )}
                            <div className="text-lg">{ request.from._id === auth._id ? request.to.username : request.from.username }</div>
                        </div>
                        <div className="flex gap-3 text-2xl">
                            { request.from._id === auth._id ? (
                                <div className="hover:text-red-500 flex items-center justify-center w-10 h-10 bg-app-0 transition-colors rounded-full friend-button"><i className="mt-1 fa-regular fa-xmark" onClick={() => handleDeleteFriendRequest(request)}></i></div>
                            ) : (
                                <>
                                    <div className="hover:text-green-500 flex items-center justify-center w-10 h-10 bg-app-0 transition-colors rounded-full friend-button"><i className="mt-1 fa-regular fa-check" onClick={() => handleAcceptFriendRequest(request)}></i></div>
                                    <div className="hover:text-red-500 flex items-center justify-center w-10 h-10 bg-app-0 transition-colors rounded-full friend-button"><i className="mt-1 fa-regular fa-xmark" onClick={() => handleDeleteFriendRequest(request)}></i></div>
                                </>
                            )}
                        </div>
                        { clicked && (
                            <ContextMenu top={`${points.y}px`} left={`${points.x}px`}>
                                <div className="flex flex-col p-2 bg-app-8 rounded" style={{width: '13rem'}}>
                                    <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"} onClick={() => handleShowProfileModal(request.from._id === auth._id ? request.to : request.from)}>Ver perfil</div>
                                    <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"}>Enviar mensaje</div>
                                    <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"}>Llamar</div>
                                    <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"}>Bloquear</div>
                                </div>
                            </ContextMenu>
                        )}
                    </div>
                ))
            ) : (
                <div className="flex flex-col gap-5 items-center py-10">
                    <div className="text-center text-lg">
                        {friends.length == 0 && filterBy == 'online' ? 'No tienes amigos conectados.' : friends.length == 0 && filterBy == 'all' ? 'Aún no tienes amigos, envía una solicitud de amistad.' : friends.length == 0 && filterBy == 'blocked' ? 'No tienes amigos bloqueados.' : 'No tienes solicitudes de amistad pendientes.'}
                    </div>
                </div>
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
            { clicked && (
                <ContextMenu top={`${points.y}px`} left={`${points.x}px`}>
                    <div className="flex flex-col p-3 bg-app-8 rounded-md" style={{width: '13rem'}}>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"} onClick={() => handleShowProfileModal(selectedFriend)}>Ver perfil</div>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"} id="friend" onClick={(e) => handleClickFriend(e.target, selectedFriend)}>Enviar mensaje</div>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"}>Llamar</div>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"} onClick={(e) => selectedFriend.blocked ? unblockFriend(selectedFriend._id) : blockFriend(selectedFriend._id)}>{ selectedFriend.blocked ? 'Desbloquear' : 'Bloquear' }</div>
                        <div className={"p-2 hover:bg-violet-500 hover:text-white transition-colors rounded cursor-pointer"} id="removeFriend" onClick={(e) => handleClickFriend(e.target, selectedFriend)}>Eliminar amigo</div>
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
                                <div className="py-2 px-4 bg-violet-500 hover:bg-violet-800 text-zinc-100 rounded-md cursor-pointer transition-colors" id="friend" onClick={(e) => handleClickFriend(e.target, selectedFriend)}>Enviar mensaje</div>
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
)(AppFriendsList);