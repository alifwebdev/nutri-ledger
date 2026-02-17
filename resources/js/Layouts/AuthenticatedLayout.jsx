import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

const NAV = [
    { href: "/dashboard", label: "Dashboard", icon: "⌂" },
    { href: "/meals", label: "Meals", icon: "🍽" },
    { href: "/expenses", label: "Expenses", icon: "💸" },
    { href: "/summary/monthly", label: "Summary", icon: "◎" },
];

export default function AuthenticatedLayout({ user, header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const path = typeof window !== "undefined" ? window.location.pathname : "";

    return (
        <div className="nl-shell">
            {/* ── Sidebar ── */}
            <aside
                className={`nl-sidebar ${sidebarOpen ? "nl-sidebar--open" : ""}`}
            >
                <div className="nl-brand">
                    <span className="nl-brand__icon">◈</span>
                    <span className="nl-brand__text">NutriLedger</span>
                </div>

                <nav className="nl-nav">
                    {NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nl-nav__item ${path === item.href ? "nl-nav__item--active" : ""}`}
                        >
                            <span className="nl-nav__icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="nl-sidebar__footer">
                    <div className="nl-user">
                        <span className="nl-user__avatar">
                            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                        </span>
                        <span className="nl-user__name">{user?.name}</span>
                    </div>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="nl-logout"
                    >
                        ⏻
                    </Link>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="nl-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Main ── */}
            <div className="nl-main">
                {/* Topbar */}
                <header className="nl-topbar">
                    <button
                        className="nl-hamburger"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        ☰
                    </button>

                    {header && (
                        <div className="nl-topbar__header">{header}</div>
                    )}

                    {/* Profile dropdown (Breeze-compatible slot) */}
                    <div className="nl-topbar__right">
                        <span className="nl-topbar__user hidden sm:block">
                            {user?.name}
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="nl-content">{children}</main>
            </div>
        </div>
    );
}
