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

const initalState = {
    chats: [],
    selectedChat: null,
    error: false,
    loading: false
}

export default function(state = initalState, action) {
    switch(action.type) {
        case GET_CHATS: 
            return {
                ...state,
                loading: true,
                error: false
            }
        case GET_CHATS_SUCCESS: 
            return {
                ...state,
                chats: action.payload
            }
        case HIDE_CHAT: 
            return {
                ...state,
                chats: state.chats.filter( chat => chat._id !== action.payload )
            }
        case SET_CHAT_MESSAGES: 
            const newChat = { ...action.payload.chat }
            newChat.messages = action.payload.messages
            return {
                ...state,
                chats: Object.keys(action.payload.chat).length != 0 ? 
                    state.chats.concat(newChat) : 
                    state.chats.map(chat => {
                    if(chat._id === action.payload.chatId) {
                        chat = { ...chat, messages: action.payload.messages }
                        return chat;
                    }
                    return chat;
                }),
            }
        case SET_SELECTED_CHAT: 
            return {
                ...state,
                selectedChat: action.payload.chatId
            }
        case SET_MESSAGES_READ: 
            return {
                ...state,
                chats: state.chats.map( chat => {
                    if(chat._id === action.payload) {
                        chat = {...chat, lastMessages: { from: null, messages: [] }};
                        return chat;
                    }
                    return chat;
                }) 
            }
        case SEND_CHAT_MESSAGE: 
            return {
                ...state,
                error: false,
                loading: true,
            }
        case SEND_CHAT_MESSAGE_SUCCESS: 
            return {
                ...state,
                chats: state.chats.map( chat => {
                    if(chat._id === action.payload.toChat) {
                        chat = {...chat, messages: [...chat.messages, action.payload.message]};
                        return chat;
                    }
                    return chat;
                }),
                error: false,
                loading: false,
            }
        case CHAT_ERROR: 
            return {
                ...state,
                loading: false,
                error: true
            }
        case RESET_CHAT: 
            return {
                ...state,
                selectedChat: null
            }

        // ------------- Socket.IO -------------

        case IO_PUSH_CHAT_MESSAGE: 
            return {
                ...state,
                chats: state.chats.map( chat => {
                    if(chat._id === action.payload.chatId) {
                        chat = {...chat, messages: [...chat.messages, { from: action.payload.from, message: action.payload.message, updatedAt: action.payload.updatedAt }]};
                        return chat;
                    }
                    return chat;
                })
            }
        case IO_PUSH_LAST_MESSAGE:
            return {
                ...state,
                chats: state.chats.map( chat => {
                    if(chat._id === action.payload.chatId) {
                        chat = {...chat, lastMessages: {from: action.payload.from._id, messages: [...chat.lastMessages.messages, action.payload.messageId], updatedAt: chat.lastMessages.updatedAt}}
                        return chat;
                    }
                    return chat;
                })
            }
        case IO_UPDATE_CHAT_FRIEND_STATUS:
            return {
                ...state,
                chats: state.chats.map(chat => {
                    const newUsers = chat.users.filter( user => user._id !== action.payload._id );
                    newUsers.push(action.payload);
                    chat = { ...chat, users: newUsers };
                    return chat;
                    // chat.users.map(user => {
                    //     if(user._id === action.payload._id) {
                    //         user = { ...user, status: action.payload.status };
                    //         return user;
                    //     }
                    //     return user;
                    // })
                    // console.log(chat);
                    // return chat;
                })
            }
        default:
            return state;
    }
}