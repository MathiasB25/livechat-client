import axios from 'axios';

import { 
    GET_CHATS,
    GET_CHATS_SUCCESS,
    HIDE_CHAT,
    SET_CHAT_MESSAGES,
    SET_SELECTED_CHAT,
    SET_MESSAGES_READ,
    SEND_CHAT_MESSAGE,
    SEND_CHAT_MESSAGE_SUCCESS,
    RESET_CHAT,
    CHAT_ERROR,
    // SOCKET.IO
    IO_PUSH_CHAT_MESSAGE,
    IO_PUSH_LAST_MESSAGE,
    IO_EDIT_CHAT_MESSAGE,
    IO_DELETE_CHAT_MESSAGE,
    IO_UPDATE_CHAT_FRIEND_STATUS
} from '../types';
import useAxiosConfig from '../../hooks/useAxiosConfig';
import randomId from '../../hooks/randomId';

export function getChats() {
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
            data.map( chat => {
                chat.messages = [];
                return chat;
            })
            dispatch( getChatsSuccessAction(data) );
        } catch (error) {
            dispatch ( chatErrorAction() )
        }
    }
}

export function hideChat(chatId) {
    return async (dispatch) => {
        // If no JWT return
        const config = useAxiosConfig();
        if(config.headers.Authorization.includes('null')) {
            dispatch( chatErrorAction() );
            return;
        }

        try {
            await axios.post('/api/chat/hideChat', { chatId, config });
            dispatch( hideChatAction(chatId) );
        } catch (error) {
            dispatch ( chatErrorAction() )
        }
    }
}

export function getChatMessages(user, callback) {
    return async (dispatch) => {
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
            const chatId = chat._id;
            dispatch( setChatMessagesAction(chatId, chat, messages) );
            callback();
        } catch (error) {
            console.log(error);
            dispatch ( chatErrorAction() )
        }
    }
}

export function setChatMessages(chatId, messages) {
    return async (dispatch) => {
        const chat = {};
        dispatch( setChatMessagesAction(chatId, chat, messages) );
    }
}

export function setSelectedChat(user, chatId, callback) {
    return async (dispatch) => {
        if(chatId) {
            dispatch ( setSelectedChatAction(chatId) );
        }

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
            if(!chatId) {
                chatId = chat._id;
                dispatch( setSelectedChatAction(chatId) );
            }
            const messages = data.messages;
            dispatch( setChatMessagesAction(chatId, chat, messages) );
            // dispatch( setMessagesReadAction(chatId) );
        } catch (error) {
            console.log(error);
            dispatch ( chatErrorAction() )
        }
    }
}

export function setMessagesRead(chatId, fetch) {
    return async ( dispatch ) => {
        if(fetch) {
            // If no JWT return
            const config = useAxiosConfig();
            if(config.headers.Authorization.includes('null')) {
                dispatch( chatErrorAction() );
                return;
            }    

            try {
                await axios.post('/api/chat/setMessagesRead', { chatId, config });
                dispatch( setMessagesReadAction(chatId) );
            } catch (error) {
                dispatch ( chatErrorAction() )
            }
        } else {
            dispatch( setMessagesReadAction(chatId) );
        }
    }
}

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

// ACTIONS

// Get Chats
const getChatsAction = () => ({
    type: GET_CHATS
})

const getChatsSuccessAction = (chats) => ({
    type: GET_CHATS_SUCCESS,
    payload: chats
})

// Hide Chat
const hideChatAction = (chatId) => ({
    type: HIDE_CHAT,
    payload: chatId
})

// Set Chat Messages
const setChatMessagesAction = (chatId, chat, messages) => ({
    type: SET_CHAT_MESSAGES,
    payload: { chatId, chat, messages }
})

// Set Selected Chat
const setSelectedChatAction = (chatId) => ({
    type: SET_SELECTED_CHAT,
    payload: { chatId } 
})

// Set Messages Read
const setMessagesReadAction = (chatId) => ({
    type: SET_MESSAGES_READ,
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



// ------------- Socket.IO -------------
// Receive message
export function pushChatMessage(message) {
    return async (dispatch) => {
        dispatch( pushChatMessageAction(message) );
        dispatch( pushLastMessageAction(message) );
    }
}
// Update chat friend status
export function updateChatFriendStatus(friend) {
    return async (dispatch) => {
        dispatch( updateChatFriendStatusAction(friend) );
    }
}

// ACTIONS
const pushChatMessageAction = (message) => ({
    type: IO_PUSH_CHAT_MESSAGE,
    payload: message
})

const pushLastMessageAction = (message) => ({
    type: IO_PUSH_LAST_MESSAGE,
    payload: { chatId: message.chatId, messageId: randomId().toString(), from: message.from }
})

const updateChatFriendStatusAction = (friend) => ({
    type: IO_UPDATE_CHAT_FRIEND_STATUS,
    payload: friend
})