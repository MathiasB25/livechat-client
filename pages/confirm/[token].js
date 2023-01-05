import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";

export default function ConfirmAccount() {

    const router = useRouter();
    const { token } = router.query;

    const [ loading, setLoading ] = useState(true);
    const [ confirmed, setConfirmed ] = useState(false);
    const [ message, setMessage ] = useState({});

    useEffect(() => {
        if(token) {
            (async () => {
                try {
                    const { data } = await axios.post('/api/user/confirmAccount', { token })
                    setConfirmed(true);
                    setMessage({ msg: data.msg, error: false });
                } catch (error) {
                    setMessage({ msg: 'Token no válido.', error: true })
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [token])

    return(
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col gap-10 bg-zinc-100 p-10 rounded-lg" style={{width: '500px'}}>
                <div className="flex items-center justify-between">
                    <div className="">
                        <div className="flex items-center gap-2 text-violet-500">
                            <div className="text-2xl"><i className="fa-solid fa-message-smile"></i></div>
                            <div className="text-xl font-medium">LiveChat</div>
                        </div>
                    </div>
                    <div className="text-center text-xl">Confirmar cuenta</div>
                </div>
                { loading && (
                    <Loading />
                )}
                { message.msg && <div className={`text-xl ${message.error && 'text-red-500'}`}>{message.msg}</div> }
                { !loading && (
                    <Link href={!loading && confirmed ? '/login' : '/'}>
                        <button className="bg-violet-500 hover:bg-violet-800 transition-colors text-white py-3 rounded-md text-lg w-full">{ !loading && confirmed ? 'Iniciar sesión' : 'Ir a inicio'}</button>
                    </Link>
                )}
            </div>
        </div>
    )
}