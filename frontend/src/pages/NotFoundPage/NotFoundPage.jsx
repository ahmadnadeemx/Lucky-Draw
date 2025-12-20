import React from "react";
import { Link } from "react-router-dom";
import Button from "../../compnents/button/Button";

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
            <div className="text-center max-w-md">
                <h1 className="text-7xl font-extrabold mb-4 text-indigo-600 dark:text-blue-500">
                    404
                </h1>
                <h2 className="text-2xl font-bold mb-2" >
                    Page Not Found
                </h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Sorry, the page you're looking for doesn't exist or may have been moved. Please check the URL or return to the dashboard.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/">
                        <Button
                            className="indigo-button"
                            text="Go to Dashboard"
                        />
                    </Link>
                    <a href="https://wa.me/923054474602" target="_blank">
                        <Button
                            className="cancel-button w-[100px]"
                            text="Help"
                        />

                    </a>
                </div>
            </div>
        </div >
    );
};

export default NotFoundPage;
























// import React from "react";
// import { Link } from "react-router-dom";

// const NotFoundPage = () => {
//     return (
//         <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
//             <div className="text-center max-w-md">
//                 <h1 className="text-7xl font-extrabold mb-4 text-blue-600 dark:text-blue-500">
//                     404
//                 </h1>
//                 <h2 className="text-2xl font-bold mb-2" >
//                     Page Not Found
//                 </h2>
//                 <p className="mb-6 text-gray-600 dark:text-gray-400">
//                     Sorry, the page you're looking for doesn't exist or may have been moved. Please check the URL or return to the dashboard.
//                 </p>
//                 <div className="flex justify-center gap-4">
//                     <Link
//                         to="/"
//                         className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-500 transition"
//                     >
//                         Go to Dashboard
//                     </Link>
//                     <Link
//                         to="/help"
//                         className="px-5 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
//                     >
//                         Get Help
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NotFoundPage;
