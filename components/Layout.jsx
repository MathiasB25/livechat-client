// NextJS
import Head from "next/head";
import Navbar from "./Navbar";

export default function Layout({children, title}) {
    return(
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div>
                <Navbar />
                <div>{children}</div>
            </div>
        </>
    )
}