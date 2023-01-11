import { 
    GET_AUTH, 
    GET_AUTH_SUCCESS, 
    UPDATE_AUTH, 
    DELETE_AUTH,
    UPDATE_USER_STATUS,
    UPDATE_USER_BANNERCOLOR,
    UPDATE_PROFILE_PHOTO,
    GET_PENDING_REQUESTS,
    GET_PENDING_REQUESTS_SUCCESS,
    ACCEPT_PENDING_REQUESTS,
    ACCEPT_PENDING_REQUESTS_SUCCESS,
    DELETE_PENDING_REQUESTS,
    DELETE_PENDING_REQUESTS_SUCCESS,
    ADD_PENDING_REQUESTS,
    ADD_FRIEND,
    ADD_FRIEND_SUCCESS,
    BLOCK_FRIEND,
    BLOCK_FRIEND_SUCCESS,
    UNBLOCK_FRIEND,
    UNBLOCK_FRIEND_SUCCESS,
    REMOVE_FRIEND,
    REMOVE_FRIEND_SUCCESS,
    AUTH_ERROR,
    FRIENDS_ERROR,
    AUTH_ERROR_MESSAGE,
    LOGOUT,
    // SOCKET.IO
    IO_UPDATE_FRIEND_STATUS,
    IO_RECEIVE_FRIEND_REQUEST,
    IO_ACCEPTED_FRIEND_REQUEST,
    IO_CANCELED_FRIEND_REQUEST,
} from '../types';

const initalState = {
    _id: null,
    username: null,
    tag: null,
    email: null,
    profilePhoto: null,
    bannerColor: null,
    friends: [],
    status: null,
    pendingRequests: [],
    authenticated: false,
    error: false,
    errorMessage: null,
    loading: false,
    friendsError: false,
    friendsLoading: false
}

export default function(state = initalState, action) {
    switch(action.type) {
        case GET_AUTH: 
            return {
                ...state,
                loading: true
            }
        case GET_AUTH_SUCCESS: 
            return {
                ...state,
                _id: action.payload._id,
                username: action.payload.username,
                tag: action.payload.tag,
                email: action.payload.email,
                profilePhoto: action.payload.profilePhoto,
                bannerColor: action.payload.bannerColor,
                friends: action.payload.friends,
                status: action.payload.status,
                authenticated: true,
                error: false,
                loading: false,
            }
        case UPDATE_AUTH: 
            return {
                ...state,
                loading: false,
                auth: action.payload,
                error: false
            }
        case DELETE_AUTH: 
            return {
                ...state,
                auth: {}
            }
        case UPDATE_USER_STATUS: 
            return {
                ...state,
                status: action.payload
            }
        case UPDATE_USER_BANNERCOLOR: 
            return {
                ...state,
                bannerColor: action.payload
            }
        case UPDATE_PROFILE_PHOTO:
            console.log(action.payload);
            return {
                ...state,
                profilePhoto: action.payload
            }
        case GET_PENDING_REQUESTS: 
            return {
                ...state,
                friendsLoading: true
            }
        case GET_PENDING_REQUESTS_SUCCESS: 
            return {
                ...state,
                pendingRequests: action.payload,
                friendsLoading: false,
                friendsError: false
            }
        case ACCEPT_PENDING_REQUESTS: 
            return {
                ...state,
                friendsLoading: true,
                friendsError: false
            }
        case ACCEPT_PENDING_REQUESTS_SUCCESS: 
            return {
                ...state,
                pendingRequests: state.pendingRequests.filter( request => {
                    return request._id != action.payload._id;
                }),
                friendsLoading: false,
                friendsError: false
            }
        case DELETE_PENDING_REQUESTS: 
            return {
                ...state,
                friendsLoading: true,
                friendsError: false
            }
        case DELETE_PENDING_REQUESTS_SUCCESS: 
            return {
                ...state,
                pendingRequests: state.pendingRequests.filter( request => {
                    return request._id != action.payload._id;
                }),
                friendsLoading: false,
                friendsError: false
            }
        case ADD_PENDING_REQUESTS: 
            return {
                ...state,
                pendingRequests: [...state.pendingRequests, action.payload],
            }
        case ADD_FRIEND: 
            return {
                ...state,
                friendsLoading: true
            }
        case ADD_FRIEND_SUCCESS: 
            return {
                ...state,
                friends: [...state.friends, action.payload],
                friendsLoading: false,
                friendsError: false
            }
        case BLOCK_FRIEND: 
            return {
                ...state,
                friendsLoading: true
            }
        case BLOCK_FRIEND_SUCCESS: 
            return {
                ...state,
                friends: state.friends.map( friend => {
                    if(friend._id === action.payload) {
                        friend.blocked = true;
                        return friend;
                    } else {
                        return friend;
                    }
                }),
                friendsLoading: false,
                friendsError: false
            }
        case UNBLOCK_FRIEND: 
            return {
                ...state,
                friendsLoading: true
            }
        case UNBLOCK_FRIEND_SUCCESS: 
            return {
                ...state,
                friends: state.friends.map( friend => {
                    if(friend._id === action.payload) {
                        friend.blocked = false;
                        return friend;
                    } else {
                        return friend;
                    }
                }),
                friendsLoading: false,
                friendsError: false
            }
        case REMOVE_FRIEND: 
            return {
                ...state,
                friendsLoading: true
            }
        case REMOVE_FRIEND_SUCCESS: 
            return {
                ...state,
                friends: state.friends.filter( friend => {
                    return friend._id != action.payload;
                }),
                friendsLoading: false,
                friendsError: false
            }
        case FRIENDS_ERROR: 
            return {
                ...state,
                friendsError: true
            }
        case AUTH_ERROR: 
            return {
                ...state,
                loading: false,
                error: true
            }
        case AUTH_ERROR_MESSAGE: 
            return {
                ...state,
                errorMessage: action.payload
            }
        case LOGOUT: 
            return {
                ...state,
                _id: null,
                username: null,
                email: null,
                profilePhoto: null,
                friends: [],
                authenticated: false,
                error: false,
                loading: false
            }

        // ------------- Socket.IO -------------
        
        case IO_UPDATE_FRIEND_STATUS:
            return {
                ...state,
                friends: state.friends.map(friend => {
                    if(friend._id === action.payload._id) {
                        friend = { ...friend, status: action.payload.status }
                        return friend;
                    }
                    return friend;
                })
            }
        case IO_RECEIVE_FRIEND_REQUEST: 
            return {
                ...state,
                pendingRequests: state.pendingRequests.concat(action.payload)
            }
        case IO_ACCEPTED_FRIEND_REQUEST: 
            return {
                ...state,
                friends: state.friends.concat(action.payload.to),
                pendingRequests: state.pendingRequests.filter(request => request._id !== action.payload._id)
            }
        case IO_CANCELED_FRIEND_REQUEST: 
            return {
                ...state,
                pendingRequests: state.pendingRequests.filter(request => request._id !== action.payload._id)
            }
        default:
            return state;
    }
}