import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
