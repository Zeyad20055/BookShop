import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Menu, X, PlusCircle, BookOpen, House } from "lucide-react";

function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 h-14 bg-white shadow-lg flex items-center justify-between px-4 md:pl-72">
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-md border border-slate-300">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <h1 className="text-lg font-bold">Admin Dashboard</h1>
      </header>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-2xl font-bold">Admin</h2>

          <button onClick={() => setOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/admin/add-book"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800"}`}
          >
            <PlusCircle size={20} />
            <span>Add Books</span>
          </NavLink>

          <NavLink
            to="/admin/all-book"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800"}`}
          >
            <BookOpen size={20} />
            <span>See All Books</span>
          </NavLink>

          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800"}`}
          >
            <House size={20} />
            <span>Return To Home Page</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="p-6 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
