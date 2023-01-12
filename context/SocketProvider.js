// React
import { createContext, useEffect, useState } from "react";
// NextJS
import { useRouter } from "next/router";
// SocketIO
import { io } from "socket.io-client";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../redux/actions'

const SocketContext = createContext();

const socket = io('http://localhost:4000');

const SocketProvider = ({ children, state, actions }) => {

    const router = useRouter();
    
    useEffect(() => {
        socket.emit('joinGlobal');
    }, [])

    useEffect(() => {
        socket.removeAllListeners()

        socket.on('receiveMessage', (message) => {
            function getChatMessagesCb() {
                actions.pushChatMessage(message, true);
            }
            if(message.to === state.auth._id) {
                const chatId = message.chatId;
                const user = message.from;
                const isChatInState = state.chat.chats.filter(chat => chat._id === chatId);
                if(isChatInState.length != 0) {
                    actions.pushChatMessage(message);
                } else {
                    actions.getChatMessages({ _id: user._id }, getChatMessagesCb)
                }
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
            console.log('asd')
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
    }, [state.auth.friends])

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