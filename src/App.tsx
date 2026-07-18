import { useRoutes } from "react-router-dom";
import { loggedInRoutes, unauthenticatedRoutes } from "./router/router";
import { useUserSettings } from "./hooks";

function App() {
  const { menus } = useUserSettings();
  console.log("menus :>> ", menus);
  const filtredChildrenRoutes = loggedInRoutes[0].children?.filter((route) =>
    menus.includes(route.path as string)
  );
  const filtredRoutes = [
    { ...loggedInRoutes[0], children: filtredChildrenRoutes },
  ];
  console.log('filtredRoutes :>> ', filtredRoutes);
  console.log('loggedInRoutes :>> ', loggedInRoutes);
  const elements = useRoutes(loggedInRoutes);
  return <>{elements}</>;
}

export default App;
