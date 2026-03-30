import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet /> {/* renders the matched child route */}
    </>
  );
}

export default Layout;