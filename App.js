import Taskbar from "./components/Taskbar";
import Login from "./Screens/Login";

export default function App() {
  let token = "111";
  return token ? <Taskbar /> : <Login />;
}
