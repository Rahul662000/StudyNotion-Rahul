import "./App.css";
import {Route,Routes} from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Navbar from "./components/common/Navbar";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import AboutPage from "./Pages/AboutPage";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./Pages/Dashboard";
import Error from "./Pages/Error"
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import Contact from "./Pages/Contact";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from './components/core/Dashboard/MyCourses'
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./Pages/Catalog";
import CourseDetails from "./Pages/CourseDetails";
import ViewCourse from "./Pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/Instructor";

function App() {

  const { user } = useSelector((state)=>state.profile)

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home/>} />

        {/* Course */}
        <Route path="courses/:courseId" element={<CourseDetails />} />

        {/* Catalog */}
        <Route path="catalog/:catalogName" element={<Catalog/>} />
        
        {/* Signup */}
        <Route 
          path="signup" 
          element={
            <OpenRoute>
              <SignUp />
            </OpenRoute>
          } />
        
        {/* Login */}
        <Route 
          path="login" 
          element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            } 
          />

        {/* forgot-password */}
          <Route 
          path="forgot-password" 
          element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            } 
          />

          {/* update password */}
          <Route 
          path="update-password/:id" 
          element={
              <OpenRoute>
                <UpdatePassword  />
              </OpenRoute>
            } 
          />

          {/* verfiy email */}
          <Route 
          path="verify-email" 
          element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            } 
          />
          
          {/* about */}
          <Route 
          path="about" 
          element={
                <AboutPage />
            } 
          />

          {/* Contact Us */}
          <Route path="/contact" element={<Contact />} />

          {/* Dashboard - myprofile*/}

          <Route  element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
          }>

            <Route path="dashboard/my-profile" element={
                <MyProfile />
            } />

            <Route path="dashboard/settings" element={
                <Settings />
            } />

            

            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route path="dashboard/cart" element={
                    <Cart />
                  } />

                  <Route path="dashboard/enrolled-courses" element={
                    <EnrolledCourses />
                  } />
                </>
              )
            }

            {
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                  <Route path="dashboard/add-course" element={
                    <AddCourse />
                  } />
                   <Route path="dashboard/my-courses" element={
                    <MyCourses />
                  } />
                  <Route path="dashboard/edit-course/:courseId" element={
                    <EditCourse />
                  } />
                  <Route path="dashboard/instructor" element={
                     <Instructor />
                  } />

                </>
              )
            }


          </Route>

          {/* Enrolled Course Details */}

          <Route element={
            <PrivateRoute>
              <ViewCourse/>
            </PrivateRoute>
          }>

            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element={<VideoDetails/>}/>

                    
                </>
              )
            }

          </Route>
          


          <Route path="*" element={<Error/>}/>
 
      </Routes>
    </div>
  );
}

export default App;




// Coding area gradient