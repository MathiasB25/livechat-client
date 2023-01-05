// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions'
// Components
import Layout from "../../components/app/Layout";
import AppFriends from "../../components/app/Friends";
import AppChat from "../../components/app/Chat";

function AppChatPage({ state, actions }) {
    return (
        <Layout title={'Chat | LiveChat'}>
            <div className="flex text-zinc-400 select-none">
                <AppFriends />
                <AppChat />
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
)(AppChatPage);