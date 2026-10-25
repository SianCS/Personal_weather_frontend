import { ToastContainer } from "react-toastify";
import AppRouter from "./routers/AppRouter";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
      />
      <AppRouter />
    </>
  );
}

export default App;
