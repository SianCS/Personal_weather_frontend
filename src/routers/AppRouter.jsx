import { createBrowserRouter, RouterProvider } from "react-router"
import Login from "../pages/Login"
import RedirectToHome from "../pages/RedirectToHome"
import { Suspense } from "react"
import UserDashboard from "../pages/UserDashboard"
import useUserStore from "../stores/userStore"
import GuestPage from "../pages/GuestPage"




const guestRouter = createBrowserRouter([
  {path : "/", Component : GuestPage },
  {path : "*" , Component : RedirectToHome},
])

const userRouter = createBrowserRouter([
  {path : "/" , Component : UserDashboard},
  {path : "*", Component : RedirectToHome},
])


function AppRouter() {

  const user = useUserStore(state => state.user)

  const finalRouter = user ? userRouter : guestRouter
  return (
    <Suspense fallback={<p>Loading...</p>}>
        <RouterProvider key={user?.id} router={finalRouter} />
    </Suspense>
  )
}
export default AppRouter