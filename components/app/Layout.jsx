// React
import { useEffect } from "react";
// NextJS
import Head from "next/head";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions';
// Components
import NoAuth from "./NoAuth";
// React toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function AppLayout({state, actions, children, title}) {

    const auth = state.auth;

    return(
        <>
            <Head>
                <title>{ !auth.loading && auth.authenticated ? title : null} { !auth.loading && !auth.authenticated ? 'Inicia sesión para usar LiveChat' : null}</title>
            </Head>
            <div className="bg-app-3">
                { auth.error && !auth.authenticated && (
                    <NoAuth />
                )}
                { !auth.loading && auth.authenticated && (
                    <div>{children}</div>
                )}
            </div>
            <ToastContainer />
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
)(AppLayout);