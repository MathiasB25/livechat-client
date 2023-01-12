// React
import { useEffect } from "react";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../redux/actions'

function ReduxActions({ state, actions, children }) {

    useEffect(() => {
        actions.getAuth(onGetAuth);
        function onGetAuth() {
            actions.getPendingRequests();
            actions.getChats();
        }
    }, [])


    return (
        <>
            {children}
        </>
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
)(ReduxActions);