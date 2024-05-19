
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import axios from "axios"
import { getUserData } from "./context/User/getUserData"
import { environmentVariables } from "./helper/helper"
import { updateUserDataState } from "./context/User/userSlice"
import LoginPage from "./pages/login/LoginPage"
import Header from "./components/Header"
import SideBar from "./components/SideBar"
import RouteLayout from "./pages/RouteLayout"

function App() {

  const dispatch = useDispatch();

  const { userId } = getUserData();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [appLoading, setAppLoading] = useState(true);

  //Validate user after app load
  useEffect(() => {

    const validateUser = async () => {
      try {

        const response = await axios.get(`${environmentVariables.backendUrl}/user/validate`,
          { withCredentials: true }
        );

        const responseData = response.data;

        if (response.status === 200) {

          const { userDetails, storageDetails } = responseData;

          const { _id, email, name, avatar, storage_limit } = userDetails || {};

          dispatch(updateUserDataState({
            userId: _id,
            name,
            email,
            avatar: avatar,
            storage_limit,
            storageDetails
          }));
        }
      } catch (error) {
        console.log(error)
      } finally {
        setAppLoading(false)
      }
    };

    validateUser();

  }, []);


  //Protect others route if user not authenticated
  useEffect(() => {

    if (!appLoading && !userId && pathname !== "/") {
      navigate('/', { replace: true })
    }

  }, [userId, appLoading])


  //Show loading before user validate
  if (appLoading) {
    return (
      <div className="w-fit min-h-screen bg-white dark:bg-gray-800">
        <div className="fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      </div>
    )
    //If server not return user so return Login page
  } else if (!userId) {
    return (<LoginPage />);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <SideBar />
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />
          <main className="py-2 px-2.5"> {/* Added padding */}
            <RouteLayout />
          </main>
        </div>
      </div>
    </>
  )
}
export default App
