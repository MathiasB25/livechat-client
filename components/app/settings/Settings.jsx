// React
import { useState } from "react";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../../redux/actions'
// Components
import AppSettingsSidebar from "./Sidebar";
import AppSettingsAccount from "./Account";
import AppSettingsProfile from "./Profile";

function AppSettingsLayout({ state, actions, close }) {

    const [ closeAnim, setCloseAnim ] = useState(false);
    const [ page, setPage ] = useState('myAccount');

    const handleChangePage = (page) => {
        setPage(page)
    }

    const handleClose = () => {
        setCloseAnim(true);
        setTimeout(() => {
            close();
        }, 170)
    }

    return(
        <div className={`absolute w-screen h-screen flex text-zinc-400 select-none ${ closeAnim ? 'opacity-anim-close' : 'opacity-anim'} z-50`}>
            <div className="flex justify-end bg-app-3 h-screen py-16" style={{width: '27%'}}>
                <AppSettingsSidebar page={page} changePage={handleChangePage} />
            </div>
            <div className="flex items-start bg-app-0 h-screen py-16 overflow-y-scroll" style={{width: '73%'}}>
                { page === 'myAccount' && <AppSettingsAccount user={state.auth} changePage={handleChangePage} /> }
                { page === 'myProfile' && <AppSettingsProfile user={state.auth} changeBanner={actions} /> }
                <div className="flex flex-col gap-1 items-center hover:text-zinc-300 cursor-pointer transition-colors" onClick={handleClose}>
                    <i className="fa-light fa-circle-xmark" style={{fontSize: '2.7rem'}}></i>
                    <div className="uppercase font-semibold pointer-events-none">Salir</div>
                </div>
            </div>
        </div>
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
)(AppSettingsLayout);