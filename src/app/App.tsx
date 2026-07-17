import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Backdrop from "@/components/ui/Backdrop";
import Workspace from "@/components/Workspace";
import Greeting from "@/features/Greeting";
import Notifications from "@/features/notifications/components/Notifications";
import SearchBar from "@/features/search/components/SearchBar";
import Settings from "@/features/settings/components/Settings";
import Shortcuts from "@/features/shortcuts/components/Shortcuts";
import TodoList from "@/features/todo/components/TodoList";
import Weather from "@/features/weather/components/Weather";
import { AppProvider } from "./AppProvider";

function App() {
	return (
		<AppProvider>
			<Header>
				<Weather />
			</Header>
			<Workspace>
				<Greeting />
				<SearchBar />
				<Shortcuts />
			</Workspace>
			<Footer />
			<Notifications />
			<TodoList />
			<Settings />
			<Backdrop />
		</AppProvider>
	);
}

export default App;
