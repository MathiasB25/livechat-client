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
        case SET_CHAT_MESSAGES: 
            return {
                ...state,
                chats: Object.keys(action.payload.chat).length != 0 ? state.chats.concat(action.payload.chat) : state.chats,
                chats: state.chats.map( chat => {
                    if(chat._id === action.payload.chatId) {
                        chat = { ...chat, messages: [] };
                        chat.messages = [...chat.messages, ...action.payload.messages];
                        return chat;
                    }
                    return chat;
                })
            }
        case SET_SELECTED_CHAT: 
            return {
                ...state,
                selectedChat: action.payload
            }
        case SET_MESSAGES_READED: 
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
        default:
            return state;
    }
}