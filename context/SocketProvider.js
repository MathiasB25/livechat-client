// React
import { createContext, useEffect } from "react";
// NextJS
import { useRouter } from "next/router";
// SocketIO
import { io } from "socket.io-client";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../redux/actions'

const SocketContext = createContext();

let socket;
const SocketProvider = ({ children, state, actions }) => {

    const router = useRouter();

    useEffect(() => {
        if(state.auth.authenticated) {
            socket = io('http://localhost:4000');
            socket.emit('joinGlobal');
        }
    }, [state.auth.authenticated])
    
    useEffect(() => {
        if(state.auth.authenticated) {
            socket.on('receiveMessage', (message) => {
                if(message.to === state.auth._id) {
                    actions.pushChatMessage(message);
                }
            });
            socket.on('userChangeStatus', (user) => {
                state.auth.friends.map(friend => {
                    if(friend._id === user._id && user._id !== state.auth._id) {
                        actions.updateFriendStatus(user);
                        actions.updateChatFriendStatus(user);
                    }
                });
            });
            socket.on('receiveFriendRequest', (request) => {
                if(request.to._id === state.auth._id) {
                    actions.receiveFriendRequest(request);
                }
            });
            socket.on('acceptedFriendRequest', (request) => {
                if(request.from._id === state.auth._id) {
                    request.to.blocked = false;
                    actions.acceptedFriendRequest(request);
                }
            });
            socket.on('canceledFriendRequest', (canceled) => {
                if(canceled.canceledBy !== state.auth._id) {
                    actions.canceledFriendRequest(canceled.request);
                }
            });
            socket.on('deleteFriend', (users) => {
                const userIsFriend = state.auth.friends.filter(friend => friend._id === users.from);
                if(userIsFriend.length != 0 && users.to === state.auth._id) {
                    actions.ioDeleteFriend(users.from);
                }
            });
        }
    }, [state.auth.authenticated])

    const sendMessage = (message) => {
        socket.emit('sendMessage', message);
    }

    const updateStatus = (user) => {
        socket.emit('userChangeStatus', user);
    }

    const sendFriendRequest = (request) => {
        socket.emit('sendFriendRequest', request); 
    }

    const acceptFriendRequest = (request) => {
        socket.emit('acceptFriendRequest', request); 
    }
    
    const cancelFriendRequest = (request) => {
        socket.emit('cancelFriendRequest', request); 
    }

    const ioDeleteFriend = (users) => {
        socket.emit('deleteFriend', users); 
    }

    return (
        <SocketContext.Provider value={{
            sendMessage,
            updateStatus,
            sendFriendRequest,
            acceptFriendRequest,
            cancelFriendRequest,
            ioDeleteFriend,
        }}>
            { children }
        </SocketContext.Provider>
    )
}

export { SocketContext }

const mapStateToProps = (state) => ({
	state: state
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SocketProvider);