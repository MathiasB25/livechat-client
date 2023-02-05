// React
import { useState } from "react";
// NextJS
import { useRouter } from "next/router";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../../redux/actions'
// Components
import Modal from "../../Modal";

function AppSettingsSidebar({ page, changePage, state, actions }) {

    const router = useRouter();

    // Remove friend modal
    const [ showModal, setShowModal ] = useState(false);
    const [ closeModal, setCloseModal ] = useState(false);

    const handleShowModal = () => {
        setShowModal(!showModal);
    }

    const handleLogout = () => {
        actions.authLogout();
        router.push('/');
    }

    return(
        <div className="flex flex-col px-3">
            <div className="flex flex-col gap-2">
                <div className="uppercase font-semibold px-3">Ajustes del usuario</div>
                <div className="flex flex-col gap-1 text-lg">
                    <div className={`py-2 px-3 hover:bg-app-0 transition-colors w-56 rounded-md cursor-pointer ${page === 'myAccount' && 'bg-app-0 text-zinc-200'}`} onClick={() => changePage('myAccount')}>Mi Cuenta</div>
                    <div className={`py-2 px-3 hover:bg-app-0 transition-colors w-56 rounded-md cursor-pointer ${page === 'myProfile' && 'bg-app-0 text-zinc-200'}`} onClick={() => changePage('myProfile')}>Mi Perfil</div>
                    <div className={`flex items-center justify-between py-2 px-3 hover:bg-app-0 transition-colors w-56 rounded-md cursor-pointer hover:text-zinc-200`} onClick={handleShowModal}>
                        <div>Cerrar sesión</div>
                        <div><i className="fa-regular fa-arrow-right-from-bracket"></i></div>
                    </div>
                </div>
            </div>
            { showModal && (
                <Modal setter={setShowModal} close={{ state: closeModal, setter: setCloseModal }}>
                    <div className="bg-app-2 rounded" style={{width: '29rem'}}>
                        <div className="flex flex-col gap-3 pt-4 pb-12 px-5">
                            <div className="text-zinc-200 text-2xl font-semibold">Cerrar sesión</div>
                            <div className="">¿ Estás seguro que deseas cerrar sesión ?</div>
                        </div>
                        <div className="bg-app-4 rounded-b p-3">
                            <div className="flex gap-5 justify-end">
                                <button className="text-zinc-300 hover:underline" onClick={() => setCloseModal(true)}>Cancelar</button>
                                <button className="py-2 px-3 text-zinc-300 bg-red-700 rounded" onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
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
)(AppSettingsSidebar);