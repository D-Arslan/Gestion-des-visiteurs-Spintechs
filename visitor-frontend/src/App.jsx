import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import AppRouter from "./router/AppRouter";

function App() {
  useEffect(() => {
    useAuthStore.getState().initialize(); // rehydrate store from localStorage
  }, []);

  return <AppRouter />;
}

export default App;
