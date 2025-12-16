export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <section className="bg-slate-50 h-screen w-screen flex flex-col">
      <TopBar />
      <main className="flex-1 overflow-hidden relative">{children}</main>
    </section>
  );
}

function TopBar() {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-slate-200">
      <div className="flex items-center">
        <img
          fetchPriority="high"
          src="/logo.webp"
          alt="Smart Tutor"
          width={70}
          height={70}
        />
        <div>
          <h1 className="text-2xl font-bold">Smart Tutor</h1>
          <p className="text-sm text-slate-500">Math Exam</p>
        </div>
      </div>
    </header>
  );
}
