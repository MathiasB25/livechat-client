// CSS
import '../styles/globals.css'
// Redux
import { Provider } from 'react-redux';
import store from '../redux/store';
// Context
import SocketProvider from '../context/SocketProvider';
// Utilites
import ReduxActions from '../utilities/ReduxActions';

export default function App({ Component, pageProps }) {
	return (
		<Provider store={store}>
			<ReduxActions>
				<SocketProvider>
					<div onContextMenu={(e) => {
						e.preventDefault(); // prevent the default behaviour when right clicked
					}}>
						<Component {...pageProps} />
					</div>
				</SocketProvider>
			</ReduxActions>
		</Provider>
	)
}
