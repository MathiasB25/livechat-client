import Link from "next/link";

export default function NoAuth() {
    return (
        <div className="flex flex-col justify-center items-center gap-14 text-lg text-center h-screen w-screen bg-app-3 text-zinc-300">
            <div className="flex flex-col gap-4">
                <div className="text-5xl">Parece que no has iniciado sesión</div>
                <div className="text-xl">Inicia sesión para empezar a usar LiveChat!</div>
            </div>
            <Link href={'/login'}>
                <div className="flex justify-center">
                    <div className="w-fit bg-white hover:bg-black transition-colors px-10 py-3 text-black hover:text-white rounded-md cursor-pointer">Iniciar sesión</div>
                </div>
            </Link>
        </div>
    )
}