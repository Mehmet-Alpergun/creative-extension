import { Outlet } from "react-router-dom";
import MainNavigation from "./components/MainNavigation";
import Footer from "./components/Footer";

export default function Root() {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
