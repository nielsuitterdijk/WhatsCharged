import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginForm } from "../users/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "@/pages/home/home";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/home" />} />
        <Route>
          <Route path="/login" element={<LoginForm />} />
          {/* <Route path="/resetpassword" element={<ResetPassword />} /> */}
          {/* <Route path="/accept_invitation" element={<AcceptInvitation />} /> */}
        </Route>
        <Route>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
