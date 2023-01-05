import axios from 'axios';

import { 
    GET_CHATS,
    GET_CHATS_SUCCESS,
    SET_CHAT_MESSAGES,
    SET_SELECTED_CHAT,
    SET_MESSAGES_READED,
    SEND_CHAT_MESSAGE,
    SEND_CHAT_MESSAGE_SUCCESS,
    RESET_CHAT,
    CHAT_ERROR,
} from '../types';
import useAxiosConfig from '../../hooks/useAxiosConfig';

export function getChats () {
    return async (dispatch) => {
        dispatch ( getChatsAction() );

        // If no JWT return
        const config = useAxiosConfig();
        if(config.headers.Authorization.includes('null')) {
            dispatch( chatErrorAction() );
            return;
        }

        try {
            const { data } = await axios.post('/api/chat/getChats', { config });
            dispatch( getChatsSuccessAction(data) );
        } catch (error) {
            dispatch ( chatErrorAction() )
        }
    }
}

export function setSelectedChat(user, chatId) {
    return async (dispatch) => {
        dispatch ( setSelectedChatAction(chatId) );

        // If no JWT return
        const config = useAxiosConfig();
        if(config.headers.Authorization.includes('null')) {
            dispatch( chatErrorAction() );
            return;
        }

        try {
            const { data } = await axios.post('/api/chat/getMessages', { user: user._id, config });
            // Set chat messages
            const chat = data.chat;
            const messages = data.messages;
            if(!chatId) {
                chatId = chat._id;
            }
            dispatch( setChatMessagesAction(chatId, chat, messages) );
            dispatch( setMessagesReadedAction(chatId) );
        } catch (error) {
            console.log(error);
            dispatch ( chatErrorAction() )
        }
    }
}

// export function setMessagesReaded(chatId) {
//     return async( dispatch ) => {
//         dispatch( setMessagesReadedAction(chatId) );
//     }
// }

// Send message
export function sendMessage(message, toChat) {
    return async (dispatch) => {
        dispatch( sendMessageAction() )

        const config = useAxiosConfig();
        if(config.headers.Authorization.includes('null')) {
            dispatch( chatErrorAction() );
            return;
        }

        try {
            await axios.post('/api/chat/sendMessage', { message: message.message, toChat, config });
            dispatch( sendMessageSuccessAction(message, toChat) );
        } catch (error) {
            console.log(error)
            dispatch( chatErrorAction() );
        }
    }
}

export function resetChat() {
    return async (dispatch) => {
        dispatch ( resetChatAction() );
    }
}



// Get Chats
const getChatsAction = () => ({
    type: GET_CHATS
})

const getChatsSuccessAction = (chats) => ({
    type: GET_CHATS_SUCCESS,
    payload: chats
})

// Set Chat Messages
const setChatMessagesAction = (chatId, chat, messages) => ({
    type: SET_CHAT_MESSAGES,
    payload: { chatId, chat, messages }
})

// Set Selected Chat
const setSelectedChatAction = (chatId) => ({
    type: SET_SELECTED_CHAT,
    payload: chatId
})

// Set Messages Readed
const setMessagesReadedAction = (chatId) => ({
    type: SET_MESSAGES_READED,
    payload: chatId
})

// Send Message
const sendMessageAction = () => ({
    type: SEND_CHAT_MESSAGE
})

const sendMessageSuccessAction = (message, toChat) => ({
    type: SEND_CHAT_MESSAGE_SUCCESS,
    payload: { message, toChat }
})

const resetChatAction = () => ({
    type: RESET_CHAT
})

const chatErrorAction = () => ({
    type: CHAT_ERROR
})