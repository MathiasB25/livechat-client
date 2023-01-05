import moment from "moment";
import { useState } from "react";

export default function AppSettingsAccount({ user, changePage }) {

    const [ email, setEmail ] = useState({ revealed: false, email: '**********@gmail.com' });

    const revealEmail = () => {
        if(email.revealed) {
            setEmail({ revealed: false, email: '**********@gmail.com' });
        } else {
            setEmail({ revealed: true, email: user.email });
        }
    }

    return(
        <div className="flex flex-col px-10 w-10/12 opacity-anim">
            <div className="flex flex-col gap-5 pb-10">
                <div className="text-2xl text-zinc-200 font-semibold">
                    <div>Mi Cuenta</div>
                </div>
                <div>
                    <div className="bg-app-2 rounded-lg">
                        <div className="rounded-t-lg" style={{minHeight: '8rem', backgroundColor: `${user.bannerColor}`}}></div>
                        <div className="relative bg-app-1 rounded-b-lg p-4 pt-0">
                            <div className="absolute left-4 rounded-full" style={{top: '-2.5rem'}}>
                                <div className="relative">
                                    {user?.profilePhoto ? (
                                        <img src={user?.profilePhoto} width={40} height={40} className="absolute top-2 left-2 w-28 h-28 rounded-full" alt="User profile photo" style={{zIndex: '10'}} />
                                    ) : (
                                        <div className="flex items-center justify-center w-28 h-28 bg-app-5 rounded-full text-5xl absolute top-2 left-2" style={{zIndex: '10'}}>
                                            <div>{user?.username?.slice(0, 1)}</div>
                                        </div>
                                    )}
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-app-1 rounded-full" style={{zIndex: '5'}}></div>
                                </div>
                            </div>
                            <div className="absolute left-40 top-4 flex items-end text-2xl font-semibold">
                                <div className="text-zinc-200">{user.username}</div>
                                <div>{`#${user.tag}`}</div>
                            </div>
                            <div className="flex items-center justify-end gap-2 py-9">
                                <div className="py-2 px-4 bg-violet-500 hover:bg-violet-800 text-zinc-100 rounded-md cursor-pointer transition-colors" onClick={() => changePage('myProfile')}>Editar mi perfil</div>
                            </div>
                            <div className="flex flex-col gap-5 bg-app-5 py-3 px-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="uppercase font-semibold">Username</div>
                                        <div>
                                            <div className="flex items-end text-lg">
                                                <div className="text-zinc-300">{user.username}</div>
                                                <div>{`#${user.tag}`}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="py-2 px-4 bg-neutral-600 hover:bg-neutral-500 transition-colors text-zinc-200 cursor-pointer rounded">Cambiar</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="uppercase font-semibold">Correo electrónico</div>
                                        <div className="flex items-end gap-2">
                                            <div className="flex items-end text-lg text-zinc-300">{email.email}</div>
                                            <div className="text-sky-500 hover:underline hover:text-sky-600 transition-colors cursor-pointer" onClick={revealEmail}>{email.revealed ? 'Ocultar' : 'Mostrar'}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="py-2 px-4 bg-neutral-600 hover:bg-neutral-500 transition-colors text-zinc-200 cursor-pointer rounded">Cambiar</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-5 pt-10 border-t border-neutral-700">
                <div className="flex flex-col gap-2">
                    <div className="uppercase font-semibold">Eliminación de cuenta</div>
                    <div>Si desactivas tu cuenta, no te preocupes, en cualquier momento la puedes recuperar!</div>
                </div>
                <div className="flex gap-4">
                    <div className="py-2 px-4 bg-red-600 text-zinc-200 font-medium rounded cursor-pointer">Desactivar cuenta</div>
                    <div className="py-2 px-4 border border-red-600 hover:bg-red-600 text-zinc-200 font-medium rounded cursor-pointer transition-colors">Eliminar cuenta</div>
                </div>
            </div>
        </div>
    )
}