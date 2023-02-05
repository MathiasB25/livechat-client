// React
import { useState, useRef } from "react";
// NextJS
import Image from "next/image";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions'
// Socket Provider
import useSocket from '../../hooks/useSocket';
// Components
import KbdKey from "./KbdKey";
// Date format
import moment from 'moment';

function AppChatMessage({ state, actions, props }) {

    const { message, chatId, to, auth } = props;

    const { editMessage, deleteMessage } = useSocket();

    const [ editingMessage, setEditingMessage ] = useState(false);
    const [ chatMessage, setChatMessage ] = useState(message.message);

    function handleEditMessage(e) {
        if(e.key === 'Enter') {
            actions.editChatMessage({ _id: chatId, message: {...message, message: chatMessage} }, false);
            editMessage({ _id: chatId, message: {...message, message: chatMessage}, to });
        }
        if(e.key === 'Escape') {
            setEditingMessage(false);
        }
    }

    function handleDeleteMessage() {
        actions.deleteChatMessage({ _id: chatId, message }, false);
        deleteMessage({ _id: chatId, message, to });
    }

    const messageOptions = useRef(null);
    const showOptions = (e) => {
        if(e.type === 'mouseenter' && messageOptions.current) {
            messageOptions.current.style.display = 'flex';
        } 
        if(e.type === 'mouseleave' && messageOptions.current) {
            messageOptions.current.style.display = 'none';
        }
    }

    return(
        <div className="flex flex-col py-2 hover:bg-app-4 transition-colors relative px-5" onMouseEnter={e => showOptions(e)} onMouseLeave={e => showOptions(e)}>
            { message.reply && (
                <div className="flex gap-1 items-end relative left-[1.25rem] mb-1">
                    <div className="border-app-0 border-l-[3px] border-t-[3px] h-4 w-10 rounded-tl-lg"></div>
                    <div className="flex items-center gap-1">
                        <div>
                            <Image src={message.reply.from.profilePhoto} width={20} height={20} className="rounded-full w-5 h-5 object-cover cursor-pointer" alt="User profile photo" />
                        </div>
                        <div className="flex items-center font-semibold hover:underline cursor-pointer text-lg">
                            <span>@</span>
                            <span>{message.reply.from.username}</span>
                        </div>
                        <div className="hover:text-zinc-200 cursor-pointer transition-colors relative top-[1px]">
                            <span>{message.reply.message}</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex gap-5">
                <div className="flex justify-center w-fit select-none overflow-hidden">
                    { message.from.profilePhoto ? (
                        <Image src={message.from.profilePhoto} width={44} height={44} className="rounded-full w-11 h-11 object-cover cursor-pointer" alt="User profile photo" />
                    ) : (
                        <div className="flex items-center justify-center w-10 h-10 bg-app-0 rounded-full cursor-pointer text-2xl">
                            <div>{message.from.username.slice(0, 1)}</div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col break-all w-full pr-10 overflow-hidden">
                    <div className="flex items-center gap-2">
                        <div className="text-lg text-zinc-200 cursor-pointer hover:underline">{message.from.username}</div>
                        <div className="">{moment(message.date).format('LLL')}</div>
                    </div>
                    { editingMessage ? (
                        <div className="flex flex-col gap-2">
                            <input onKeyDown={(e) => handleEditMessage(e)} className="outline-none bg-app-3 rounded-lg p-3 px-4" type="text" name="" id="" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-red-800 transition-colors" onClick={() => handleEditMessage({ key: 'Escape' })}>
                                    <KbdKey>ESC</KbdKey>
                                    <span>Cancel</span>
                                </div>
                                <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-200 transition-colors" onClick={() => handleEditMessage({ key: 'Enter' })}>
                                    <KbdKey>ENTER</KbdKey>
                                    <span>Save</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <span className="text-zinc-300">{message.message}</span>
                            { message.edited && <span className="text-xs">{'(edited)'}</span> }
                        </div>
                    )}
                </div>
                { !editingMessage && (
                    <div ref={messageOptions} className="hidden absolute items-center bg-app-3 border border-app-7 right-3 -top-4 rounded-l rounded-r">
                        <div className={`grid place-items-center w-9 h-9 cursor-pointer hover:bg-app-1 transition-colors rounded-l ${message.from._id !== auth ? 'block' : 'hidden'}`}>
                            <i className="fa-solid fa-reply"></i>
                        </div>
                        <div className={`grid place-items-center w-9 h-9 cursor-pointer hover:bg-app-1 transition-colors ${message.from._id !== auth ? 'rounded-r' : 'rounded-l'}`}>
                            <i className="fa-solid fa-thumbtack"></i>
                        </div>
                        <div onClick={() => setEditingMessage(!editingMessage)} className={`grid place-items-center w-9 h-9 cursor-pointer hover:bg-app-1 transition-colors ${message.from._id !== auth ? 'hidden rounded-r' : 'rounded-l'}`}>
                            <i className="fa-solid fa-pen"></i>
                        </div>
                        <div onClick={handleDeleteMessage} className={`grid place-items-center w-9 h-9 cursor-pointer hover:bg-app-1 transition-colors rounded-r ${message.from._id === auth ? 'block' : 'hidden'}`}>
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                )}
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
)(AppChatMessage);