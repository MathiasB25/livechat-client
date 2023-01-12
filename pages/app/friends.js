// React
import { useEffect, useState } from "react";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions'
// Components
import Layout from "../../components/app/Layout";
import AppFriends from "../../components/app/Friends";
import AppAddFriend from "../../components/app/AddFriend";
import AppFriendsList from "../../components/app/FriendsList";

function AppFriendsPage({ state, actions }) {

    const [ showAddFriend, setShowAddFriend ] = useState(false);
    const [ friendsListFilterBy, setFriendsListFilterBy ] = useState('online');

    const handleShowAddFriend = () => {
        setShowAddFriend(true);
        setFriendsListFilterBy('');
    }

    const handleFriendListFilter = (filterBy) => {
        setShowAddFriend(false);
        setFriendsListFilterBy(filterBy);
    }

    // useEffect(() => {
    //     actions.getPendingRequests();
    //     actions.getChats();
    // }, [])

    return(
        <Layout title={'Amigos | LiveChat'}>
            <div className="flex text-zinc-400 select-none">
                <AppFriends props={{ auth: state.auth }} />
                <div className="flex flex-col h-screen bg-app-6" style={{width: 'calc(100vw - 300px)'}}>
                    <div className="flex gap-3 items-center bg-app-3 p-4 px-6 overflow-x-scroll invisible-scrollbar">
                        <div className="flex items-center gap-3 text-left px-2 py-1">
                            <div className=""><i className="text-xl fa-solid fa-user-group"></i></div>
                            <div className="text-xl">Amigos</div>
                        </div>
                        <div className="bg-neutral-700 h-full" style={{width: '1px'}}></div>
                        <div className={`whitespace-nowrap px-2 py-1 hover:bg-neutral-700 transition-colors cursor-pointer rounded-md ${friendsListFilterBy === 'online' && 'bg-neutral-700'}`} onClick={() => handleFriendListFilter('online')}>En línea</div>
                        <div className={`whitespace-nowrap px-2 py-1 hover:bg-neutral-700 transition-colors cursor-pointer rounded-md ${friendsListFilterBy === 'all' && 'bg-neutral-700'}`} onClick={() => handleFriendListFilter('all')}>Todos</div>
                        <div className={`flex items-center gap-2 whitespace-nowrap px-2 py-1 hover:bg-neutral-700 transition-colors cursor-pointer rounded-md ${friendsListFilterBy === 'pending' && 'bg-neutral-700'}`} onClick={() => handleFriendListFilter('pending')}>
                            <div>Pendiente</div>
                            { state.auth.pendingRequests.length != 0 && (
                                <div className="grid place-items-center text-white text-sm bg-violet-500 w-5 h-5 rounded-full">
                                    <div className="relative top-[.01rem] text-[.75rem] font-extrabold">{state.auth.pendingRequests.length}</div>
                                </div>
                            )}
                        </div>
                        <div className={`whitespace-nowrap px-2 py-1 hover:bg-neutral-700 transition-colors cursor-pointer rounded-md ${friendsListFilterBy === 'blocked' && 'bg-neutral-700'}`} onClick={() => handleFriendListFilter('blocked')}>Bloqueados</div>
                        <div className={`whitespace-nowrap px-2 py-1 bg-violet-500 hover:bg-violet-800 text-white transition-colors cursor-pointer rounded-md`} onClick={handleShowAddFriend}>Agregar amigo</div>
                    </div>
                    { showAddFriend ? <AppAddFriend /> : <AppFriendsList filterBy={friendsListFilterBy} /> }
                </div>
            </div>
        </Layout>
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
)(AppFriendsPage);