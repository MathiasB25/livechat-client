// Components
import Image from "next/image";
// Date format
import moment from 'moment';

export default function AppChatMessage({ message }) {
    return(
        <div className="flex py-2 hover:bg-app-4 transition-colors overflow-hidden">
            <div className="flex justify-center w-20 select-none">
                { message.from.profilePhoto ? (
                    <Image src={message.from.profilePhoto} width={40} height={40} className="rounded-full w-10 h-10 object-cover cursor-pointer" alt="User profile photo" />
                ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-app-0 rounded-full cursor-pointer text-2xl">
                        <div>{message.from.username.slice(0, 1)}</div>
                    </div>
                )}
            </div>
            <div className="flex flex-col break-all w-full pr-10">
                <div className="flex items-center gap-2">
                    <div className="text-lg text-zinc-200 cursor-pointer hover:underline">{message.from.username}</div>
                    <div className="">{moment(message.date).format('LLL')}</div>
                </div>
                <div className="">{message.message}</div>
            </div>
        </div>
    )
}