// React
import { useEffect, useState } from 'react';
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions'
// Hooks
import useSocket from '../../hooks/useSocket';
// Form validation
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
// Notifications
import { toast } from 'react-toastify';

const schema = Yup.object().shape({
    username: Yup.string()
        .min(2, 'El nombre de usuario muy corto')
        .max(30, 'Nombre de usuario muy largo')
        .matches(/[A-Za-z0-9]+#/i, 'Nombre de usuario no válido')
});

function AppAddFriend({ state, actions }) {

    const { sendFriendRequest } = useSocket();

    const [ formSubmited, setFormSubmited ] = useState(false);

    function runToast(message) {
        toast(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    return(
        <div className="flex flex-col gap-8 py-6 px-8 border-b border-app-3 opacity-anim">
            <div className="flex flex-col">
                <div className="uppercase text-xl text-zinc-300 font-medium">Agrega amigos</div>
                <div>Agrega amigos usando su nombre de usuario. Ej: LiveChat#1234</div>
            </div>
            <Formik
                initialValues={{
                    username: ''
                }}
                validationSchema={schema}
                onSubmit={(values, { resetForm }) => {
                    if(formSubmited || values.username === '') {
                        return
                    }
                    if(Number(values.username.split('#')[1]).toString().length !== 4) {
                        runToast('Usuario no válido');
                        return
                    }
                    setFormSubmited(true);
                    actions.addFriend(values.username.split('#')[0], values.username.split('#')[1], runToast, sendFriendRequest);
                    if(!state.auth.loading) {
                        resetForm();
                        setFormSubmited(false);
                    }
                }}
                >
                {({ errors, touched }) => (
                    <Form className="flex flex-col gap-1">
                        <div className="flex items-center justify-between bg-app-8 px-4 rounded-xl">
                            <Field disabled={formSubmited ? true : false} name="username" type="text" className={`mr-4 py-5 bg-transparent outline-none w-full placeholder:text-zinc-500 ${errors.username && touched.username && 'border-red-500'}`} placeholder="Ingresa un nombre de usuario" autoComplete="off" /> 
                            <button disabled={formSubmited ? true : false} type="submit" className={`whitespace-nowrap text-white transition-colors py-2 px-5 rounded-md ${formSubmited ? 'bg-violet-500 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-800'}`}>Enviar solicitud de amistad</button>
                        </div>
                        {errors.username && touched.username ? <div className='text-red-700 font-light'>{errors.username}</div> : null}
                    </Form>
                )}
            </Formik>
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
)(AppAddFriend);