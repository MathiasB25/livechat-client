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
    username: Yup.string()
        .min(2, 'Nombre de usuario muy corto')
        .max(30, 'Nombre de usuario muy largo')
        .required('El nombre de usuario es obligatorio'),
    email: Yup.string()
        .email('Ingresa un correo electrónico válido')
        .required('El correo electrónico es obligatorio'),
    password: Yup.string()
        .min(8, 'La contraseña es muy corta')
        .required('El contraseña es obligatoria'),
    repeatPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Las contraseñas no son iguales")
        .min(8, 'La contraseña es muy corta')
        .required('El contraseña es obligatoria'),
});

function Register({state, actions}) {

    const router = useRouter();

    const auth = state.auth;

    const [ formSubmited, setFormSubmited ] = useState(false);
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
                <div className="flex flex-col gap-10 p-5 bg-white rounded-xl shadow-md h-fit" style={{width: '500px'}}>
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
                            username: '',
                            email: '',
                            password: '',
                            repeatPassword: ''
                        }}
                        validationSchema={schema}
                        onSubmit={async (values, { resetForm }) => {
                            if(formSubmited) {
                                return
                            }
                            setFormSubmited(true);
                            try {
                                await axios.post('/api/user/register', {
                                    username: values.username,
                                    email: values.email,
                                    password: values.password
                                })
                                resetForm();
                                router.push('/login');
                            } catch (error) {
                                setFormMessage({
                                    msg: error.response.data.msg,
                                    error: true
                                });
                                setTimeout(() => {
                                    setFormMessage({});
                                }, 6000)
                            } finally {
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
                                    <label className="block" htmlFor="username">Nombre de usuario</label>
                                    <Field disabled={formSubmited ? true : false} type="text" className={`border rounded-md w-full py-3 outline-none px-3 ${errors.username && touched.username && 'border-red-500'}`} name="username" placeholder="Ingresa tu nombre de usuario" id="username" />
                                    {errors.username && touched.username ? <div className='text-sm text-red-500'>{errors.username}</div> : null}
                                </div>
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
                                <div className="text-base">
                                    <label className="block" htmlFor="repeatPass">Repetir contraseña</label>
                                    <Field disabled={formSubmited ? true : false} name="repeatPassword" type="password" className={`border rounded-md w-full py-3 outline-none px-3 ${errors.repeatPassword && touched.repeatPassword && 'border-red-500'}`} placeholder="Ingresa tu contraseña" id="repeatPass" />
                                    {errors.repeatPassword && touched.repeatPassword ? <div className='text-sm text-red-500'>{errors.repeatPassword}</div> : null}
                                </div>
                                <button disabled={formSubmited ? true : false} type="submit" className={`mt-5 ${formSubmited ? 'bg-violet-500 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-800'} text-white py-3 rounded-md w-full transition-colors text-lg`}>Crear mi cuenta</button>
                            </Form>
                        )}
                    </Formik>
                    <div className="flex">
                        <Link href={"/login"}><div className="hover:text-violet-500 transition-colors">Ya tienes cuenta? Inicia sesión</div></Link>
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
)(Register);