// Axios
import axios from 'axios';
// React
import { useEffect, useRef, useState } from "react";
// NextJS
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/router';
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../redux/actions'
// Components
import NavbarUser from '../components/NavbarUser';
// Form validation
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';

const schema = Yup.object().shape({
    email: Yup.string()
        .email('Ingresa un correo electrónico válido')
        .required('El correo electrónico es obligatorio'),
    password: Yup.string()
        .min(8, 'La contraseña es muy corta, mínimo 8 caracteres.')
        .max(32, 'La contraseña es muy larga, máximo 32 caracteres.')
        .required('El contraseña es obligatoria.'),
});

function Login({ state, actions }) {

    const router = useRouter;

    const auth = state.auth;
    
    const [ formSubmited, setFormSubmited ] = useState(true);
    const [ formMessage, setFormMessage ] = useState({});

    useEffect(() => {
        const auth = localStorage.getItem('vtNw6cNcqEqD');
        auth ? setFormSubmited(true) : setFormSubmited(false);
    }, [])

    useEffect(() => {
        if(auth.error && !auth.username)  {
            setFormSubmited(false);
        }
    }, [auth])

    return(
        <div className='bg-zinc-100 h-screen'>
            <div className="flex items-center justify-between px-20 h-20 bg-zinc-100 border-b">
                <Link href={"/"}>
                    <div className="flex items-center gap-2 text-violet-500 hover:scale-105 transition-all">
                        <div className="text-2xl"><i className="fa-solid fa-message-smile"></i></div>
                        <div className="text-xl font-medium">LiveChat</div>
                    </div>
                </Link>
                <NavbarUser />
            </div>
            <div className={`flex justify-center py-10 ${!auth.username && 'items-center'} bg-zinc-100`}>
                <div className="flex flex-col gap-10 p-5 bg-white rounded-xl shadow-md" style={{width: '500px'}}>
                    <div className="flex justify-end">
                        <Link href={"/"}>
                            <div className="flex items-center gap-2 text-violet-500 hover:scale-105 transition-all">
                                <div className="text-2xl"><i className="fa-solid fa-message-smile"></i></div>
                                <div className="text-xl font-medium">LiveChat</div>
                            </div>
                        </Link>
                    </div>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        validationSchema={schema}
                        onSubmit={async (values, { resetForm }) => {
                            if(formSubmited) {
                                return
                            }
                            setFormSubmited(true);
                            try {
                                const { data } = await axios.post('/api/user/login', {
                                    email: values.email,
                                    password: values.password
                                })
                                localStorage.setItem('vtNw6cNcqEqD', data.token);
                                actions.getAuth();
                                resetForm();
                                setFormMessage({
                                    msg: 'Has iniciado sesión correctamente',
                                    error: false
                                });
                            } catch (error) {
                                setFormMessage({
                                    msg: error.response.data.msg,
                                    error: true
                                });
                                setTimeout(() => {
                                    setFormMessage({});
                                }, 6000)
                                setFormSubmited(false);
                            }
                        }}
                        >
                        {({ errors, touched }) => (
                            <Form className="flex flex-col gap-5">
                                { formMessage.msg && (
                                    <div className={`${formMessage.error ? 'bg-red-500' : 'bg-violet-500'} text-white w-full py-2 rounded-md text-center`}>{formMessage.msg}</div>
                                )}
                                <div className="text-base">
                                    <label className="block" htmlFor="email">Correo electrónico</label>
                                    <Field disabled={formSubmited ? true : false} name="email" type="email" className={`border rounded-md w-full py-3 outline-none px-3 ${errors.email && touched.email && 'border-red-500'}`} placeholder="Ingresa tu correo electrónico" id="email" /> 
                                    {errors.email && touched.email ? <div className='text-sm text-red-500'>{errors.email}</div> : null}
                                </div>
                                <div className="text-base">
                                    <label className="block" htmlFor="pass">Contraseña</label>
                                    <Field disabled={formSubmited ? true : false} name="password" type="password" className={`border rounded-md w-full py-3 outline-none px-3 ${errors.password && touched.password && 'border-red-500'}`} placeholder="Ingresa tu contraseña" id="pass" />
                                    {errors.password && touched.password ? <div className='text-sm text-red-500'>{errors.password}</div> : null}
                                </div>
                                <button disabled={formSubmited ? true : false} type="submit" className={`mt-5 ${formSubmited ? 'bg-violet-500 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-800'} text-white py-3 rounded-md w-full transition-colors text-lg`}>Iniciar sesión</button>
                            </Form>
                        )}
                    </Formik>
                    <div className="flex justify-between">
                        <Link href={"/register"}><div className="hover:text-violet-500 transition-colors">No tienes cuenta? Registrate</div></Link>
                        <Link href={"/forgot-password"}><div className="hover:text-violet-500 transition-colors">Olvidé mi contraseña</div></Link>
                    </div>
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
)(Login);