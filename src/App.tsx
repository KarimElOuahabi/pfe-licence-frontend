import { useRoutes } from "react-router-dom";
import { loggedInRoutes, unauthenticatedRoutes } from "./router/router";

function App() {
  const elements = useRoutes(loggedInRoutes);
  return <>{elements}</>;
}

export default App;
