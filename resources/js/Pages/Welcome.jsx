import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const features = [
        {
            icon: "🍽",
            title: "Meal Tracking",
            desc: "Log every breakfast, lunch, dinner and snack. Track calories and build healthy daily habits effortlessly.",
        },
        {
            icon: "💸",
            title: "Expense Tracking",
            desc: "Categorise your daily spending — food, transport, health and more — with a clean per-day or monthly view.",
        },
        {
            icon: "◎",
            title: "Monthly Summaries",
            desc: "Visual donut charts, calendar heatmaps and day-by-day tables give you a full picture of each month.",
        },
        {
            icon: "🔒",
            title: "Private by Default",
            desc: "Every meal and expense belongs only to you. No sharing, no leaking — your data stays yours.",
        },
    ];

    return (
        <>
            <Head title="NutriLedger — Track Meals & Expenses" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;400;500;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                :root {
                    --cream:     #faf7f2;
                    --parchment: #f2ede3;
                    --warm-100:  #e8e0d0;
                    --warm-200:  #d4c9b5;
                    --ink:       #2a2218;
                    --ink-60:    rgba(42,34,24,0.6);
                    --ink-30:    rgba(42,34,24,0.3);
                    --amber:     #d97706;
                    --amber-light: #fef3c7;
                    --green:     #059669;
                    --font-d: 'DM Serif Display', Georgia, serif;
                    --font-b: 'DM Sans', system-ui, sans-serif;
                }

                html { scroll-behavior: smooth; }

                body {
                    font-family: var(--font-b);
                    background: var(--cream);
                    color: var(--ink);
                    -webkit-font-smoothing: antialiased;
                }

                /* ── Noise texture overlay ── */
                body::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0.4;
                }

                /* ── Navbar ── */
                .wl-nav {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 100;
                    padding: 18px 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(250,247,242,0.88);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--warm-100);
                }

                .wl-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                }
                .wl-logo__mark {
                    width: 36px; height: 36px;
                    background: var(--ink);
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 17px;
                    color: var(--amber);
                }
                .wl-logo__text {
                    font-family: var(--font-d);
                    font-size: 21px;
                    color: var(--ink);
                    letter-spacing: -0.3px;
                }

                .wl-nav__links {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .wl-link {
                    padding: 8px 18px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    text-decoration: none;
                    color: var(--ink-60);
                    transition: color 0.15s;
                }
                .wl-link:hover { color: var(--ink); }
                .wl-link--cta {
                    background: var(--ink);
                    color: #fff !important;
                    font-weight: 600;
                }
                .wl-link--cta:hover { background: #3d3020; }

                /* ── Hero ── */
                .wl-hero {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 120px 40px 80px;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }

                /* decorative blobs */
                .wl-hero::before,
                .wl-hero::after {
                    content: '';
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    pointer-events: none;
                    z-index: 0;
                }
                .wl-hero::before {
                    width: 600px; height: 600px;
                    background: radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%);
                    top: -100px; left: -100px;
                }
                .wl-hero::after {
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%);
                    bottom: -80px; right: -80px;
                }

                .wl-hero__inner {
                    position: relative;
                    z-index: 1;
                    max-width: 760px;
                }

                .wl-hero__eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--amber-light);
                    color: var(--amber);
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    padding: 6px 16px;
                    border-radius: 99px;
                    margin-bottom: 28px;
                    animation: fadeUp 0.6s ease both;
                }

                .wl-hero__title {
                    font-family: var(--font-d);
                    font-size: clamp(46px, 7vw, 88px);
                    line-height: 1.05;
                    color: var(--ink);
                    letter-spacing: -2px;
                    margin-bottom: 24px;
                    animation: fadeUp 0.6s 0.1s ease both;
                }
                .wl-hero__title em {
                    font-style: italic;
                    color: var(--amber);
                }

                .wl-hero__sub {
                    font-size: 18px;
                    color: var(--ink-60);
                    line-height: 1.65;
                    max-width: 520px;
                    margin: 0 auto 44px;
                    animation: fadeUp 0.6s 0.2s ease both;
                }

                .wl-hero__actions {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 14px;
                    flex-wrap: wrap;
                    animation: fadeUp 0.6s 0.3s ease both;
                }

                .wl-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 14px 32px;
                    border-radius: 10px;
                    font-family: var(--font-b);
                    font-size: 15px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.15s;
                    cursor: pointer;
                }
                .wl-btn--dark {
                    background: var(--ink);
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(42,34,24,0.18);
                }
                .wl-btn--dark:hover {
                    background: #3d3020;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 24px rgba(42,34,24,0.24);
                }
                .wl-btn--outline {
                    background: transparent;
                    color: var(--ink);
                    border: 1.5px solid var(--warm-200);
                }
                .wl-btn--outline:hover {
                    border-color: var(--ink);
                    background: var(--parchment);
                }

                /* ── Floating stat pills ── */
                .wl-stats {
                    display: flex;
                    justify-content: center;
                    gap: 14px;
                    flex-wrap: wrap;
                    margin-top: 60px;
                    animation: fadeUp 0.6s 0.4s ease both;
                    position: relative;
                    z-index: 1;
                }
                .wl-stat-pill {
                    background: #fff;
                    border: 1px solid var(--warm-100);
                    border-radius: 12px;
                    padding: 14px 22px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 2px 10px rgba(42,34,24,0.07);
                }
                .wl-stat-pill__icon {
                    font-size: 24px;
                    width: 44px; height: 44px;
                    background: var(--parchment);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .wl-stat-pill__label {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--ink-60);
                }
                .wl-stat-pill__value {
                    font-family: var(--font-d);
                    font-size: 22px;
                    color: var(--ink);
                    line-height: 1;
                }

                /* ── Divider ── */
                .wl-divider {
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--warm-200), transparent);
                    margin: 0 40px;
                }

                /* ── Features ── */
                .wl-features {
                    padding: 100px 40px;
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .wl-features__header {
                    text-align: center;
                    margin-bottom: 60px;
                }
                .wl-features__tag {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--amber);
                    margin-bottom: 14px;
                }
                .wl-features__title {
                    font-family: var(--font-d);
                    font-size: clamp(32px, 4vw, 52px);
                    letter-spacing: -1px;
                    line-height: 1.1;
                    color: var(--ink);
                }
                .wl-features__title em { font-style: italic; }

                .wl-features__grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                }

                .wl-feature-card {
                    background: #fff;
                    border: 1px solid var(--warm-100);
                    border-radius: 16px;
                    padding: 32px;
                    transition: all 0.2s;
                    position: relative;
                    overflow: hidden;
                }
                .wl-feature-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, var(--parchment) 0%, transparent 60%);
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .wl-feature-card:hover {
                    border-color: var(--warm-200);
                    box-shadow: 0 8px 32px rgba(42,34,24,0.08);
                    transform: translateY(-2px);
                }
                .wl-feature-card:hover::before { opacity: 1; }

                .wl-feature-card__icon {
                    font-size: 32px;
                    width: 60px; height: 60px;
                    background: var(--parchment);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    position: relative;
                    z-index: 1;
                }
                .wl-feature-card__title {
                    font-family: var(--font-d);
                    font-size: 22px;
                    margin-bottom: 10px;
                    position: relative;
                    z-index: 1;
                }
                .wl-feature-card__desc {
                    font-size: 15px;
                    color: var(--ink-60);
                    line-height: 1.65;
                    position: relative;
                    z-index: 1;
                }

                /* ── CTA Banner ── */
                .wl-cta {
                    margin: 0 40px 100px;
                    background: var(--ink);
                    border-radius: 24px;
                    padding: 72px 60px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                }
                .wl-cta::before {
                    content: '';
                    position: absolute;
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 70%);
                    top: -200px; left: -100px;
                    pointer-events: none;
                }
                .wl-cta::after {
                    content: '';
                    position: absolute;
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%);
                    bottom: -150px; right: -50px;
                    pointer-events: none;
                }
                .wl-cta__eyebrow {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--amber);
                    margin-bottom: 20px;
                }
                .wl-cta__title {
                    font-family: var(--font-d);
                    font-size: clamp(32px, 4vw, 56px);
                    color: #fff;
                    letter-spacing: -1.5px;
                    line-height: 1.1;
                    margin-bottom: 16px;
                    position: relative;
                    z-index: 1;
                }
                .wl-cta__title em {
                    font-style: italic;
                    color: var(--amber);
                }
                .wl-cta__sub {
                    font-size: 16px;
                    color: rgba(255,255,255,0.55);
                    margin-bottom: 40px;
                    position: relative;
                    z-index: 1;
                }
                .wl-cta__actions {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    flex-wrap: wrap;
                    position: relative;
                    z-index: 1;
                }
                .wl-btn--amber {
                    background: var(--amber);
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(217,119,6,0.35);
                }
                .wl-btn--amber:hover {
                    background: #b45309;
                    transform: translateY(-1px);
                }
                .wl-btn--ghost-white {
                    background: rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.75);
                    border: 1px solid rgba(255,255,255,0.15);
                }
                .wl-btn--ghost-white:hover {
                    background: rgba(255,255,255,0.15);
                    color: #fff;
                }

                /* ── Footer ── */
                .wl-footer {
                    border-top: 1px solid var(--warm-100);
                    padding: 28px 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    z-index: 1;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .wl-footer__brand {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: var(--font-d);
                    font-size: 16px;
                    color: var(--ink);
                }
                .wl-footer__mark {
                    width: 26px; height: 26px;
                    background: var(--ink);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    color: var(--amber);
                }
                .wl-footer__meta {
                    font-size: 12px;
                    color: var(--ink-60);
                }

                /* ── Animations ── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ── Responsive ── */
                @media (max-width: 700px) {
                    .wl-nav { padding: 14px 20px; }
                    .wl-hero { padding: 100px 20px 60px; }
                    .wl-features { padding: 60px 20px; }
                    .wl-features__grid { grid-template-columns: 1fr; }
                    .wl-cta { margin: 0 20px 60px; padding: 48px 28px; }
                    .wl-footer { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
                    .wl-stats { gap: 10px; }
                    .wl-stat-pill { padding: 10px 16px; }
                    .wl-divider { margin: 0 20px; }
                }
            `}</style>

            {/* ── Nav ── */}
            <nav className="wl-nav">
                <div className="wl-logo">
                    <div className="wl-logo__mark">◈</div>
                    <span className="wl-logo__text">NutriLedger</span>
                </div>
                <div className="wl-nav__links">
                    {auth.user ? (
                        <Link
                            href={route("dashboard")}
                            className="wl-link wl-link--cta"
                        >
                            Go to Dashboard →
                        </Link>
                    ) : (
                        <>
                            <Link href={route("login")} className="wl-link">
                                Log in
                            </Link>
                            <Link
                                href={route("register")}
                                className="wl-link wl-link--cta"
                            >
                                Get Started Free
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="wl-hero">
                <div className="wl-hero__inner">
                    <div className="wl-hero__eyebrow">
                        ✦ Your personal health ledger
                    </div>
                    <h1 className="wl-hero__title">
                        Track what you <em>eat.</em>
                        <br />
                        Track what you <em>spend.</em>
                    </h1>
                    <p className="wl-hero__sub">
                        NutriLedger is the calm, private way to log your daily
                        meals and expenses — with beautiful monthly summaries
                        that actually make sense of your habits.
                    </p>
                    <div className="wl-hero__actions">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="wl-btn wl-btn--dark"
                            >
                                Open Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("register")}
                                    className="wl-btn wl-btn--dark"
                                >
                                    Start for free
                                </Link>
                                <Link
                                    href={route("login")}
                                    className="wl-btn wl-btn--outline"
                                >
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Stat pills */}
                <div className="wl-stats">
                    <div className="wl-stat-pill">
                        <div className="wl-stat-pill__icon">🍽</div>
                        <div>
                            <div className="wl-stat-pill__label">
                                Meal Types
                            </div>
                            <div className="wl-stat-pill__value">4</div>
                        </div>
                    </div>
                    <div className="wl-stat-pill">
                        <div className="wl-stat-pill__icon">💸</div>
                        <div>
                            <div className="wl-stat-pill__label">
                                Categories
                            </div>
                            <div className="wl-stat-pill__value">8</div>
                        </div>
                    </div>
                    <div className="wl-stat-pill">
                        <div className="wl-stat-pill__icon">◎</div>
                        <div>
                            <div className="wl-stat-pill__label">Reports</div>
                            <div className="wl-stat-pill__value">
                                Daily &amp; Monthly
                            </div>
                        </div>
                    </div>
                    <div className="wl-stat-pill">
                        <div className="wl-stat-pill__icon">🔒</div>
                        <div>
                            <div className="wl-stat-pill__label">Privacy</div>
                            <div className="wl-stat-pill__value">100%</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="wl-divider" />

            {/* ── Features ── */}
            <section className="wl-features">
                <div className="wl-features__header">
                    <div className="wl-features__tag">What's inside</div>
                    <h2 className="wl-features__title">
                        Everything you need,
                        <br />
                        <em>nothing you don't.</em>
                    </h2>
                </div>
                <div className="wl-features__grid">
                    {features.map((f, i) => (
                        <div key={i} className="wl-feature-card">
                            <div className="wl-feature-card__icon">
                                {f.icon}
                            </div>
                            <h3 className="wl-feature-card__title">
                                {f.title}
                            </h3>
                            <p className="wl-feature-card__desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA banner ── */}
            <section className="wl-cta">
                <div className="wl-cta__eyebrow">Ready to start?</div>
                <h2 className="wl-cta__title">
                    Know your habits.
                    <br />
                    <em>Own your health.</em>
                </h2>
                <p className="wl-cta__sub">
                    Free to use. No ads. No data sold. Ever.
                </p>
                <div className="wl-cta__actions">
                    {auth.user ? (
                        <Link
                            href={route("dashboard")}
                            className="wl-btn wl-btn--amber"
                        >
                            Go to Dashboard →
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("register")}
                                className="wl-btn wl-btn--amber"
                            >
                                Create your account
                            </Link>
                            <Link
                                href={route("login")}
                                className="wl-btn wl-btn--ghost-white"
                            >
                                Already have an account
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="wl-footer">
                <div className="wl-footer__brand">
                    <div className="wl-footer__mark">◈</div>
                    NutriLedger
                </div>
                <div className="wl-footer__meta">
                    Laravel v{laravelVersion} &nbsp;·&nbsp; PHP v{phpVersion}
                </div>
            </footer>
        </>
    );
}
