const sideStats = [
  { label: 'Slots monitored', value: '1,248' },
  { label: 'Active sessions', value: '326' },
  { label: 'Uptime', value: '99.9%' },
];

export default function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen bg-[#f6f8fb] text-[#172033] lg:grid-cols-[minmax(0,1fr)_520px]">
      <section className="relative hidden overflow-hidden bg-[#10233f] text-white lg:block">
        <img
          alt="Modern parking garage"
          className="absolute inset-0 h-full w-full object-cover opacity-28 grayscale"
          src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1400&q=80"
        />
        <div className="absolute inset-0 bg-[#10233f]/70" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <img
              alt="Parking System Logo"
              className="h-12 w-12 rounded-full bg-white object-cover"
              src="/parking-system-logo.png"
            />
            <div>
              <p className="text-lg font-semibold">Parking System</p>
              <p className="text-xs uppercase tracking-[0.08em] text-[#b9c7da]">
                Operations console
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#8db6ff]">
              Secure access
            </p>
            <h1 className="mb-5 text-5xl font-semibold leading-tight">
              Manage parking operations with clarity.
            </h1>
            <p className="max-w-lg text-base leading-7 text-[#d5deea]">
              Sign in to monitor sessions, vehicles, reservations, payments, and staff activity
              from one focused workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {sideStats.map((item) => (
              <div className="rounded border border-white/15 bg-white/10 p-4" key={item.label}>
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="mt-1 text-xs text-[#c7d3e3]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-8 lg:min-h-0">
        <div className="w-full max-w-[420px]">{children}</div>
      </section>
    </main>
  );
}
