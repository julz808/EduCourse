
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-edu-light-blue">
      <Navigation />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
