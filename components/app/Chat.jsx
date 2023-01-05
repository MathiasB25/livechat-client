// React
import { useEffect, useRef, useState } from "react";
// NextJS
import { useRouter } from "next/router";
// SocketIO
import { io } from "socket.io-client";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions'
// Components
import AppChatMessage from "./ChatMessage";
import AppUserStatus from "./UserStatus";
// Hooks
import useSocket from "../../hooks/useSocket";
import randomId from "../../hooks/randomId";

function AppChat({ state, actions, props }) {

    const router = useRouter();

    const { sendMessage } = useSocket();
    
    const [ chat, setChat ] = useState({});
    const [ user, setUser ] = useState({});
    const [ messages, setMessages ] = useState([]);
    
    useEffect(() => {
        if(!state.chat.selectedChat) {
            router.push('/app/friends')
        }
    }, []);

    useEffect(() => {
        if(state.chat.selectedChat && state.chat.chats.length != 0) {
            setChat(state.chat.chats.filter( chat => chat._id === state.chat.selectedChat )[0]);
            if(Object.keys(chat).length != 0) {
                setUser(chat.users.filter( user => user._id !== state.auth._id )[0]);
                setMessages(chat.messages || []);
            }
        }
    }, [state.chat, state.chat.selectedChat, chat])

    // const [ message, setMessage ] = useState('');

    const messagesElement = useRef(null);
    useEffect(() => {
        if(messagesElement.current) {
            messagesElement.current.scrollTop = messagesElement.current.scrollHeight;
        }
    }, [messages])

    const messageInput = useRef(null);
    const handleSendMessage = (e) => {
        e.preventDefault();
        const message = messageInput.current.value;
        e.preventDefault();
        actions.sendMessage({ message, from: { username: state.auth.username, profilePhoto: state.auth.profilePhoto }, createdAt: Date.now() }, state.chat.selectedChat);
        sendMessage({ from: state.auth._id, to: user._id, message });
        messageInput.current.value = '';
    }

    return(
        <div className="flex flex-col h-screen bg-app-6" style={{width: 'calc(100vw - 300px)'}}>
            { state.chat.selectedChat && Object.keys(user).length != 0 && (
                <>
                    <div className="flex items-center justify-between text-xl px-5 h-20 border-b border-app-3">
                        <div className="flex items-center gap-3">
                            <div><i className="text-2xl fa-solid fa-at"></i></div>
                            { Object.keys(chat).length != 0 && Object.keys(user).length != 0 && (
                                <>
                                    <div className="cursor-pointer">{ user.username }</div>
                                    <AppUserStatus status={ user.status } />
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-7 text-2xl">
                            <button className="hover:text-zinc-300 transition-colors"><i className="fa-solid fa-phone-volume"></i></button>
                            <button className="hover:text-zinc-300 transition-colors"><i className="fa-solid fa-thumbtack"></i></button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between select-text" style={{height: 'calc(100vh - 5rem)'}}>
                        <div ref={messagesElement} className="overflow-y-scroll h-full">
                            { messages && messages.length !== 0 ? (
                                <div className="flex flex-col gap-4 py-5">
                                    {messages.map( message => (
                                        <AppChatMessage key={randomId()} message={message} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-lg">Aún no hay mensajes en esta conversación.</div>
                            )}
                        </div>
                        <div className="p-5 pt-2">
                            <div className="flex gap-5 items-center py-3 px-5 bg-app-3 w-full rounded-xl">
                                <div>
                                    <label htmlFor="uploadFile" className="flex items-center justify-center w-8 h-8 bg-neutral-500 hover:bg-neutral-400 rounded-full text-app-3 transition-colors text-lg cursor-pointer"><i className="fa-solid fa-plus"></i></label>
                                    <input type="file" name="" id="uploadFile" className="hidden" />
                                </div>
                                <form onSubmit={handleSendMessage} className="w-full">
                                    <input ref={messageInput} type="text" className="text-lg py-2 bg-transparent outline-none w-full placeholder:text-zinc-500" placeholder={`Envía un mensaje a @${ user ? user.username : '' }`} />
                                </form>
                                <button className="text-3xl hover:text-zinc-300 transition-colors"><i className="fa-solid fa-face-sunglasses"></i></button>
                            </div>
                        </div>
                    </div>
                </>
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
)(AppChat);