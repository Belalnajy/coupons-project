// import { Header } from "./Header";
// import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <>
      <div className="h-dvh flex flex-col">
        {/* <Header /> */}
        <main className="grow">
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
}
