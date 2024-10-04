import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./assets/css/Main.css";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { Bounce, ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </AuthProvider>
    </Suspense>
  );
};

export default App;
