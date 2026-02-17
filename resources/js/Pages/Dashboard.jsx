import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useApi } from "@/hooks/useApi";

const MONTH_NAMES = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function StatCard({ label, value, sub, color }) {
    return (
        <div className={`nl-stat nl-stat--${color}`}>
            <span className="nl-stat__label">{label}</span>
            <span className="nl-stat__value">{value}</span>
            {sub && <span className="nl-stat__sub">{sub}</span>}
        </div>
    );
}

function TrendChart({ days }) {
    if (!days?.length) return null;
    const maxExp = Math.max(...days.map((d) => d.expense_total), 1);
    const maxMeal = Math.max(...days.map((d) => d.meal_count), 1);

    return (
        <div className="nl-card">
            <h3 className="nl-card__title">Last 7 Days</h3>
            <div className="nl-chart">
                {days.map((day) => (
                    <div key={day.date} className="nl-chart__col">
                        <div className="nl-chart__bars">
                            <div
                                className="nl-chart__bar nl-chart__bar--expense"
                                style={{
                                    height: `${(day.expense_total / maxExp) * 100}%`,
                                }}
                                title={`$${day.expense_total}`}
                            />
                            <div
                                className="nl-chart__bar nl-chart__bar--meal"
                                style={{
                                    height: `${(day.meal_count / maxMeal) * 100}%`,
                                }}
                                title={`${day.meal_count} meals`}
                            />
                        </div>
                        <span className="nl-chart__label">
                            {new Date(day.date + "T00:00:00")
                                .toLocaleDateString("en", { weekday: "short" })
                                .charAt(0)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="nl-legend">
                <span>
                    <span className="nl-legend__dot nl-legend__dot--expense" />
                    Expenses
                </span>
                <span>
                    <span className="nl-legend__dot nl-legend__dot--meal" />
                    Meals
                </span>
            </div>
        </div>
    );
}

export default function Dashboard({ auth }) {
    const { get, loading } = useApi();
    const [data, setData] = useState(null);
    const today = new Date();

    useEffect(() => {
        get("/summary/dashboard")
            .then(setData)
            .catch(() => {});
    }, []);

    const fmt = (n) => (n != null ? `$${Number(n).toFixed(2)}` : "—");
    const cal = (n) => (n != null ? `${Number(n).toFixed(0)} kcal` : "—");

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="nl-page-title">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="nl-page">
                {/* Today */}
                <section className="nl-section">
                    <h3 className="nl-section__heading">
                        Today &mdash;{" "}
                        {today.toLocaleDateString("en", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </h3>
                    <div className="nl-stats-grid">
                        <StatCard
                            label="Meals Eaten"
                            value={
                                loading ? "…" : (data?.today?.meal_count ?? 0)
                            }
                            sub="today"
                            color="amber"
                        />
                        <StatCard
                            label="Calories"
                            value={
                                loading ? "…" : cal(data?.today?.total_calories)
                            }
                            sub="today"
                            color="green"
                        />
                        <StatCard
                            label="Spent Today"
                            value={
                                loading ? "…" : fmt(data?.today?.expense_total)
                            }
                            sub={`${data?.today?.expense_count ?? 0} transactions`}
                            color="rose"
                        />
                    </div>
                </section>

                {/* This month */}
                <section className="nl-section">
                    <h3 className="nl-section__heading">
                        {MONTH_NAMES[today.getMonth() + 1]}{" "}
                        {today.getFullYear()} Overview
                    </h3>
                    <div className="nl-stats-grid">
                        <StatCard
                            label="Total Meals"
                            value={
                                loading
                                    ? "…"
                                    : (data?.this_month?.total_meals ?? 0)
                            }
                            sub="this month"
                            color="amber"
                        />
                        <StatCard
                            label="Total Calories"
                            value={
                                loading
                                    ? "…"
                                    : cal(data?.this_month?.total_calories)
                            }
                            sub="this month"
                            color="green"
                        />
                        <StatCard
                            label="Monthly Spend"
                            value={
                                loading
                                    ? "…"
                                    : fmt(data?.this_month?.total_expenses)
                            }
                            sub={`${data?.this_month?.expense_count ?? 0} transactions`}
                            color="rose"
                        />
                    </div>
                </section>

                {/* 7-day chart */}
                <TrendChart days={data?.last_7_days} />
            </div>
        </AuthenticatedLayout>
    );
}
