import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import WalletBar from "./WalletBar";

export default function WalletLayout() {
  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SideNav />

      {/* Main content */}
      <div className="flex-1 relative ml-32">
        {/* quick inline test for WalletBar */}
        {typeof WalletBar === "function" ? (
          // render inline (not absolutely positioned) to avoid portal/position issues
          <div className="mb-4">
            <WalletBar />
          </div>
        ) : (
          <div className="bg-red-500 text-white px-3 py-1 rounded">WalletBar not a component</div>
        )}
        {/* WalletBar */}
{/*        <div className="absolute top-4 right-4 z-50">
          <WalletBar />
        </div> */}

        {/* Page content (child routes render here) */}
        <main className="pt-20 px-6 h-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
