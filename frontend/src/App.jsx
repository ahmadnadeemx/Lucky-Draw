import React from "react";
import "./App.css";
import Sidebar from "./compnents/sidebar/Sidebar";
import { Outlet } from "react-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import Layout from "./Layout";
import { MembersProvider } from "../context/MembersContext";

const App = () => {
  return (
    <AuthProvider>
      <MembersProvider>
        <div className="flex">
          {/* Sidebar (hidden or slides in on small screens) */}
          <Sidebar />

          {/* Main content */}
          <div
            className={`flex-grow transition-all duration-300 pt-[50px] overflow-x-hidden `}
            style={{ minHeight: "100vh" }}
          >
            <Layout />
            <Toaster />
          </div>
        </div>
      </MembersProvider>
    </AuthProvider>
  );
};

export default App;

// import React from "react";
// import "./App.css";
// import Sidebar from "./compnents/sidebar/Sidebar";
// import { Outlet } from "react-router";
// import { AuthProvider, useAuth } from "../context/AuthContext";
// import { Toaster } from "react-hot-toast";
// import Layout from "./Layout";
// import { MembersProvider } from "../context/MembersContext";

// const App = () => {
//   return (
//     <AuthProvider>
//       <MembersProvider>
//       <div className="flex">
//         {/* Sidebar (hidden or slides in on small screens) */}
//         <Sidebar />

//         {/* Main content */}
//         <div
//           className={`flex-grow transition-all duration-300 pt-[50px] overflow-x-hidden sm:ml-64`}
//           style={{ minHeight: "100vh" }}
//         >
//           <Layout />
//           <Toaster />
//         </div>
//       </div>
//       </MembersProvider>
//     </AuthProvider>
//   );
// };

// export default App;
