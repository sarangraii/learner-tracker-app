import { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function WizardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-stretch bg-gradient-to-br from-slate-100 to-white">
      <Sidebar />
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-3xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/60">
          {children}
        </div>
      </main>
    </div>
  );
}
