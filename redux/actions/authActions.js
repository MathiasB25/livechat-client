import axios from 'axios';

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
    FRIENDS_ERROR,
    AUTH_ERROR,
    AUTH_ERROR_MESSAGE,
    LOGOUT,
} from '../types';
import useAxiosConfig from '../../hooks/useAxiosConfig';

//GET auth
export function getAuth() {
    return async (dispatch) => {
        dispatch( getAuthAction() )

        try {
            const token = localStorage.getItem('vtNw6cNcqEqD')
            if(!token) {
                dispatch( authErrorAction() );
                return;
            }

            const config = useAxiosConfig();
            const { data: auth } = await axios.post('/api/user/profile', { config });
            dispatch(getAuthSuccessAction(auth))
        } catch (error) {
            dispatch(authErrorAction())
        }
    }
}

//UPDATE auth
export function updateAuth(auth) {
    return (dispatch) => {
        dispatch( updateAuthAction(auth) )
    }
}

//DELETE auth
export function deleteAuth() {
    return (dispatch) => {
        dispatch( deleteAuthAction() )
    }
}

export function updateUserState(status) {
    return async (dispatch) => {
        dispatch( updateUserStateAction(status) );

        const token = localStorage.getItem('vtNw6cNcqEqD')
            if(!token) {
                dispatch( authErrorAction() );
                return;
            }

        const config = useAxiosConfig();
        try {
            await axios.post('/api/user/status', { status, config })
        } catch (error) {
            console.log(error)
        }
    }
}

export function updateUserBannerColor(color, callback) {
    return async (dispatch) => {
        // Validate if 'color' is a hex color
        const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const isValid = regex.test(color);
        if(!isValid) {
            callback({ success: false });
            return;
        }

        dispatch( updateUserBannerColorAction(color) );

        const token = localStorage.getItem('vtNw6cNcqEqD')
            if(!token) {
                dispatch( authErrorAction() );
                return;
            }

        const config = useAxiosConfig();
        try {
            await axios.post('/api/user/banner', { color, config })
            callback({ success: true });
        } catch (error) {
            console.log(error);
            callback({ success: false });
        }
    }
}

export function updateProfilePhoto(imageUrl) {
    return async (dispatch) => {
        dispatch ( updateProfilePhotoAction(imageUrl) );
    }
}

// GET Pending Requests
export function getPendingRequests() {
    return async (dispatch) => {
        dispatch( getPendingRequestsAction() );

        const token = localStorage.getItem('vtNw6cNcqEqD')
        if(!token) {
            dispatch( friendsErrorAction() );
            return;
        }

        const config = useAxiosConfig();
        try {
            const { data } = await axios.post('/api/user/friends/requests/get', { config });
            dispatch( getPendingRequestsSuccessAction(data) )
        } catch (error) {
            dispatch( friendsErrorAction() );
        }
    }
}

// Accept Pending Request 
export function acceptPendingRequest(request) {
    return async (dispatch) => {
        dispatch( acceptPendingRequestAction() );

        const token = localStorage.getItem('vtNw6cNcqEqD')
        if(!token) {
            dispatch( friendsErrorAction() );
            return;
        }

        const config = useAxiosConfig();
        try {
            await axios.post('/api/user/friends/requests/accept', { request: request._id, config });
            dispatch( acceptPendingRequestSuccessAction(request) )
            request.from.blocked = false;
            request.from.status = 'offline';
            dispatch ( addFriendSuccessAction(request.from) )
        } catch (error) {
            dispatch( friendsErrorAction() );
        }
    }
}
// Delete Pending Request 
export function deletePendingRequest(request) {
    return async (dispatch) => {
        dispatch( deletePendingRequestAction() );

        const token = localStorage.getItem('vtNw6cNcqEqD')
        if(!token) {
            dispatch( friendsErrorAction() );
            return;
        }

        const config = useAxiosConfig();
        try {
            await axios.post('/api/user/friends/requests/delete', { request, config });
            dispatch( deletePendingRequestSuccessAction(request) )
        } catch (error) {
            dispatch( friendsErrorAction() );
        }
    }
}

// Add Friend
export function addFriend(username, tag, callback) {
    return async (dispatch) => {
        dispatch( addFriendAction() )

        const token = localStorage.getItem('vtNw6cNcqEqD')
        if(!token) {
            dispatch( friendsErrorAction() );
            return;
        }

        const config = useAxiosConfig();
        try {
            const { data } = await axios.post('/api/user/friends/add', { username, tag, config });
            callback(data.msg)
            dispatch( addFriendRequestAction(data.data) )
        } catch (error) {
            callback(error.response.data.msg)
            dispatch( authErrorMessageAction(error.response.data.msg) )
            dispatch( friendsErrorAction() );
        }
    }
}

// Block Friend
export function blockFriend(userId) {
    return async (dispatch) => {
        dispatch( blockFriendAction() )

        const token = localStorage.getItem('vtNw6cNcqEqD')
        if(!token) {
            dispatch( friendsErrorAction() );
            return;
        }

        const config = useAxiosConfig();
        try {
            await axios.post('/api/user/friends/block', { userId, config });
            dispatch( blockFriendSuccessAction(userId) )
        } catch (error) {
            dispatch( friendsErrorAction() );
        }
    }
}

// Unblock Friend
export function unblockFriend(userId) {
    return async (dispatch) => {
        dispatch( unblockFriendAction() )

        const token = localStorage.getItem('vtNw6cNcqEqD')
        if(!token) {
            dispatch( friendsErrorAction() );
            return;
        }

        const config = useAxiosConfig();
        try {
            await axios.post('/api/user/friends/unblock', { userId, config });
            dispatch( unblockFriendSuccessAction(userId) )
        } catch (error) {
            dispatch( friendsErrorAction() );
        }
    }
}

// Remove Friend
export function removeFriend(userId) {
    return async (dispatch) => {
        dispatch( removeFriendAction() )

        const token = localStorage.getItem('vtNw6cNcqEqD')
        if(!token) {
            dispatch( friendsErrorAction() );
            return;
        }

        const config = useAxiosConfig();
        try {
            await axios.post('/api/user/friends/remove', { userId, config });
            dispatch( removeFriendSuccessAction(userId) )
        } catch (error) {
            dispatch( friendsErrorAction() );
        }
    }
}

export function authLogout() {
    return (dispatch) => {
        dispatch( logoutAction() )
        localStorage.removeItem('vtNw6cNcqEqD');
    }
}




// GET auth
const getAuthAction = () => ({
    type: GET_AUTH
})

const getAuthSuccessAction = (auth) => ({
    type: GET_AUTH_SUCCESS,
    payload: auth
})

// UPDATE auth
const updateAuthAction = () => ({
    type: UPDATE_AUTH,
    payload: auth
})

// DELETE auth
const deleteAuthAction = () => ({
    type: DELETE_AUTH
})

// GET Pending Requests
const getPendingRequestsAction = () => ({
    type: GET_PENDING_REQUESTS
})

const getPendingRequestsSuccessAction = (requests) => ({
    type: GET_PENDING_REQUESTS_SUCCESS,
    payload: requests
})

// Add Pending Requests
const addFriendRequestAction = (request) => ({
    type: ADD_PENDING_REQUESTS,
    payload: request
})

// Accept Pending Request
const acceptPendingRequestAction = () => ({
    type: ACCEPT_PENDING_REQUESTS
})

const acceptPendingRequestSuccessAction= (request) => ({
    type: ACCEPT_PENDING_REQUESTS_SUCCESS,
    payload: request
})

// Delete Pending Request
const deletePendingRequestAction = () => ({
    type: DELETE_PENDING_REQUESTS
})

const deletePendingRequestSuccessAction= (request) => ({
    type: DELETE_PENDING_REQUESTS_SUCCESS,
    payload: request
})

// Add Friend
const addFriendAction = () => ({
    type: ADD_FRIEND
})

const addFriendSuccessAction = (friend) => ({
    type: ADD_FRIEND_SUCCESS,
    payload: friend
})

// Block Friend
const blockFriendAction = () => ({
    type: BLOCK_FRIEND
})

const blockFriendSuccessAction = (userId) => ({
    type: BLOCK_FRIEND_SUCCESS,
    payload: userId
})

// Unblock Friend
const unblockFriendAction = () => ({
    type: UNBLOCK_FRIEND
})

const unblockFriendSuccessAction = (userId) => ({
    type: UNBLOCK_FRIEND_SUCCESS,
    payload: userId
})

// Remove Friend
const removeFriendAction = () => ({
    type: REMOVE_FRIEND
})

const removeFriendSuccessAction = (userId) => ({
    type: REMOVE_FRIEND_SUCCESS,
    payload: userId
})

const updateUserStateAction = (state) => ({
    type: UPDATE_USER_STATUS,
    payload: state
})

const updateUserBannerColorAction = (color) => ({
    type: UPDATE_USER_BANNERCOLOR,
    payload: color
})

const updateProfilePhotoAction = (imageUrl) => ({
    type: UPDATE_PROFILE_PHOTO,
    payload: imageUrl
})


// Friends ERROR
const friendsErrorAction = () => ({
    type: FRIENDS_ERROR
})

// ERROR
const authErrorAction = () => ({
    type: AUTH_ERROR
})

const authErrorMessageAction = (message) => ({
    type: AUTH_ERROR_MESSAGE,
    payload: message
})

const logoutAction = () => ({
    type: LOGOUT
})