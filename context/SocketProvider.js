// React
import { createContext, useEffect } from "react";
// SocketIO
import { io } from "socket.io-client";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../redux/actions'

const SocketContext = createContext();

let socket;
const SocketProvider = ({ children, state, actions }) => {

    useEffect(() => {
        socket = io('http://localhost:4000');
        socket.emit('joinGlobal');
    }, [])
    
    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            console.log(message);
            if(message.to === state.auth._id) {
            }
        })
    }, [])

    const sendMessage = (message) => {
        socket.emit('sendMessage', message);
    }

    // useEffect(() => {
    //     if(state.auth.username) {
    //         socket.emit('joinMessages', '43278432432');
    //         socket.emit('joinFriend', '43298473289423');
    //         socket.emit('message', { from: state.auth.username, message: 'Hola, que tal?' });
    //         socket.emit('friend', { _id: '8u4832jf89jr893j89f', username: 'Noxs' });
    //     }
    // }, [state.auth.username])

    // useEffect(() => {
    //     socket.on('friend', (message) => {
    //         console.log(message);
    //     })
    //     socket.on('message', (message) => {
    //         console.log(message);
    //     })
    // }, [])

    return (
        <SocketContext.Provider value={{
            sendMessage
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