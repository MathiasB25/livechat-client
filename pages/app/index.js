// React
import { useEffect } from "react";
// NextJS
import Image from "next/image";
import { useRouter } from "next/router";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions'
// Components
import Layout from "../../components/app/Layout";
import AppFriends from "../../components/app/Friends";

function AppIndex({ state, actions }){

    const router = useRouter();
    useEffect(() => {
        router.push('/app/friends');
    }, [])

    return(
        <Layout title={'Inicio | LiveChat'}>
            <div className="flex text-zinc-400 select-none">
                <div className="bg-app-7 w-screen h-screen"></div>
                {/* <AppFriends /> */}
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
)(AppIndex);