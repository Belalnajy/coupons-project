import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#111] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="container mx-auto max-w-[1600px] p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
