# Editorial-Intelligence


 {authUser ? (
                <button type="button" onClick={openDashboard} className="rounded-full bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-primary-container sm:px-4 sm:text-xs">
                  Dashboard
                </button>
              ) : (
                /* Authentication is temporarily paused in the navigation; keep this control for re-enabling later.
                <button type="button" onClick={openAuthModal} className="rounded-full border border-primary bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-primary-container sm:px-4 sm:text-xs">
                  Login / Register
                </button>
                */ null
              )}