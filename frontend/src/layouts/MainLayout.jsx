import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-xl font-bold text-blue-600">
            University Question Bank Portal
          </h1>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;