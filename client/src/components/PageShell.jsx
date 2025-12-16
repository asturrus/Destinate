// client/src/components/PageShell.jsx
export default function PageShell({ title, subtitle, actions, children }) {
    return (
      <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        {/* soft background glow accents */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
  
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Page header */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                {title}
              </h1>
  
              {subtitle && (
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  {subtitle}
                </p>
              )}
            </div>
  
            {actions && (
              <div className="flex flex-wrap items-center gap-2">
                {actions}
              </div>
            )}
          </div>
  
          {/* Page content */}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    );
  }
  