// NextJS
import Link from "next/link";
// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../redux/actions'
// Components
import Layout from "../components/Layout";

function Home({state, actions}) {

	const auth = state.auth;

	return (
		<>
			<div className="app-gradient">
				<Layout title={"Inicio | Comparte momentos con tus amigos y descubre gente nueva en LiveChat"} >
					<div className="relative" style={{height: "calc(100vh - 5rem)"}}>
						{/* <div style={{zIndex: '-1'}} className="relative opacity-70"><Image src={'/homeBannerBG.png'} width="1920" height="800" /></div> */}
						<div className="flex flex-col gap-14 items-center justify-center absolute top-0 w-full h-full">
							<div className="text-white flex flex-col gap-5 justify-center items-center">
								<div className="text-6xl uppercase font-semibold">{ auth.username ? 'Únete a la diversión' : 'Crea tu cuenta' }</div>
								<div className="text-xl">{ auth.username ? 'Únete a la diversión, comparte momentos con tus amigos y descubre gente nueva en LiveChat!' : 'Crea tu cuenta, comparte momentos con tus amigos y descubre gente nueva en LiveChat!' }</div>
							</div>
							<Link href={ auth.username ? '/app' : '/register' }>
								<button className="px-10 py-3 rounded-full bg-white hover:bg-black hover:text-white transition-colors">{ auth.username ? 'Entrar a la aplicación' : 'Unirme ahora' }</button>
							</Link>
						</div>
					</div>
				</Layout>
			</div>
			<div>

			</div>
		</>
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
)(Home);