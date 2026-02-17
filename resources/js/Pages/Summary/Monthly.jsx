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

const CAT_LABELS = {
    food: "Food & Dining",
    groceries: "Groceries",
    transport: "Transport",
    utilities: "Utilities",
    entertainment: "Entertainment",
    health: "Health & Medical",
    shopping: "Shopping",
    other: "Other",
};

const PALETTE = [
    "#d97706",
    "#059669",
    "#3b82f6",
    "#8b5cf6",
    "#e11d48",
    "#ec4899",
    "#f97316",
    "#6b7280",
];

const TYPE_COLORS = {
    breakfast: "#d97706",
    lunch: "#3b82f6",
    dinner: "#8b5cf6",
    snack: "#059669",
};

/* ── Pure-SVG donut ── */
function Donut({ slices, size = 140, thick = 26 }) {
    const r = (size - thick) / 2;
    const circ = 2 * Math.PI * r;
    const cx = size / 2;
    const cy = size / 2;
    const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
    let offset = 0;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: "rotate(-90deg)" }}
        >
            {slices.map((sl, i) => {
                const dash = (sl.value / total) * circ;
                const el = (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke={sl.color}
                        strokeWidth={thick}
                        strokeDasharray={`${dash} ${circ - dash}`}
                        strokeDashoffset={-offset}
                        opacity={0.88}
                    />
                );
                offset += dash;
                return el;
            })}
        </svg>
    );
}

/* ── Calendar heatmap ── */
function Heatmap({ days }) {
    if (!days?.length) return null;
    const maxExp = Math.max(...days.map((d) => d.expense_total), 1);

    const weeks = [];
    let week = [];
    const firstDow = new Date(days[0].date + "T00:00:00").getDay();
    for (let i = 0; i < firstDow; i++) week.push(null);

    days.forEach((d) => {
        week.push(d);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    });
    if (week.length) {
        while (week.length < 7) week.push(null);
        weeks.push(week);
    }

    return (
        <div className="nl-heatmap">
            <div className="nl-heatmap__dow">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span key={i}>{d}</span>
                ))}
            </div>
            {weeks.map((wk, wi) => (
                <div key={wi} className="nl-heatmap__week">
                    {wk.map((day, di) =>
                        day ? (
                            <div
                                key={di}
                                className="nl-heatmap__cell"
                                style={{ "--i": day.expense_total / maxExp }}
                                title={`${day.date}: ${day.meal_count} meals · $${day.expense_total.toFixed(2)}`}
                            >
                                {new Date(day.date + "T00:00:00").getDate()}
                            </div>
                        ) : (
                            <div
                                key={di}
                                className="nl-heatmap__cell nl-heatmap__cell--empty"
                            />
                        ),
                    )}
                </div>
            ))}
            <div className="nl-heatmap__legend">
                <span>Low</span>
                <div className="nl-heatmap__grad" />
                <span>High spend</span>
            </div>
        </div>
    );
}

/* ── Page ── */
export default function MonthlySummary({ auth }) {
    const { get, loading } = useApi();
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [data, setData] = useState(null);

    const prev = () =>
        month === 1
            ? (setYear((y) => y - 1), setMonth(12))
            : setMonth((m) => m - 1);
    const next = () =>
        month === 12
            ? (setYear((y) => y + 1), setMonth(1))
            : setMonth((m) => m + 1);

    useEffect(() => {
        get("/summary/monthly", { year, month })
            .then(setData)
            .catch(() => {});
    }, [year, month]);

    const expenseSlices = data
        ? Object.entries(data.expenses.by_category).map(([k, v], i) => ({
              label: CAT_LABELS[k] ?? k,
              value: v.total,
              color: PALETTE[i % PALETTE.length],
          }))
        : [];

    const mealSlices = data
        ? Object.entries(data.meals.by_type ?? {}).map(([t, count]) => ({
              label: t,
              value: count,
              color: TYPE_COLORS[t] ?? "#6b7280",
          }))
        : [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="nl-page-title">Monthly Summary</h2>}
        >
            <Head title="Monthly Summary" />

            <div className="nl-page">
                {/* Month navigator */}
                <div className="nl-month-nav">
                    <button className="nl-month-nav__btn" onClick={prev}>
                        ‹
                    </button>
                    <h2 className="nl-month-nav__label">
                        {MONTH_NAMES[month]} {year}
                    </h2>
                    <button className="nl-month-nav__btn" onClick={next}>
                        ›
                    </button>
                </div>

                {loading && <p className="nl-loading">Loading summary…</p>}

                {data && (
                    <>
                        {/* KPI row */}
                        <div className="nl-kpi-row">
                            <div className="nl-kpi nl-kpi--amber">
                                <span className="nl-kpi__num">
                                    {data.meals.total}
                                </span>
                                <span className="nl-kpi__label">
                                    Total Meals
                                </span>
                                <span className="nl-kpi__sub">
                                    {data.meals.avg_per_day}/day avg
                                </span>
                            </div>
                            <div className="nl-kpi nl-kpi--green">
                                <span className="nl-kpi__num">
                                    {Number(data.meals.total_calories).toFixed(
                                        0,
                                    )}
                                </span>
                                <span className="nl-kpi__label">
                                    Total Calories
                                </span>
                            </div>
                            <div className="nl-kpi nl-kpi--rose">
                                <span className="nl-kpi__num">
                                    ${Number(data.expenses.total).toFixed(2)}
                                </span>
                                <span className="nl-kpi__label">
                                    Total Spent
                                </span>
                                <span className="nl-kpi__sub">
                                    $
                                    {Number(data.expenses.avg_per_day).toFixed(
                                        2,
                                    )}
                                    /day avg
                                </span>
                            </div>
                            <div className="nl-kpi nl-kpi--violet">
                                <span className="nl-kpi__num">
                                    {data.expenses.count}
                                </span>
                                <span className="nl-kpi__label">
                                    Transactions
                                </span>
                            </div>
                        </div>

                        {/* Donut charts */}
                        <div className="nl-charts-row">
                            <div className="nl-card">
                                <h3 className="nl-card__title">
                                    Expense Breakdown
                                </h3>
                                <div className="nl-donut-wrap">
                                    <Donut slices={expenseSlices} />
                                </div>
                                <div className="nl-legend-list">
                                    {expenseSlices.map((sl, i) => (
                                        <div key={i} className="nl-legend-item">
                                            <span
                                                className="nl-legend-item__dot"
                                                style={{ background: sl.color }}
                                            />
                                            <span className="nl-legend-item__label">
                                                {sl.label}
                                            </span>
                                            <span className="nl-legend-item__val">
                                                ${sl.value.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="nl-card">
                                <h3 className="nl-card__title">
                                    Meals by Type
                                </h3>
                                <div className="nl-donut-wrap">
                                    <Donut slices={mealSlices} />
                                </div>
                                <div className="nl-legend-list">
                                    {mealSlices.map((sl, i) => (
                                        <div key={i} className="nl-legend-item">
                                            <span
                                                className="nl-legend-item__dot"
                                                style={{ background: sl.color }}
                                            />
                                            <span
                                                className="nl-legend-item__label"
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {sl.label}
                                            </span>
                                            <span className="nl-legend-item__val">
                                                {sl.value} meals
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Heatmap */}
                        <div className="nl-card">
                            <h3 className="nl-card__title">
                                Daily Spending Heatmap
                            </h3>
                            <Heatmap days={data.daily_breakdown} />
                        </div>

                        {/* Day-by-day table */}
                        <div className="nl-card">
                            <h3 className="nl-card__title">
                                Day-by-Day Breakdown
                            </h3>
                            <div className="nl-table">
                                <div className="nl-table__head">
                                    <span>Date</span>
                                    <span>Meals</span>
                                    <span>Calories</span>
                                    <span>Spent</span>
                                    <span>Txns</span>
                                </div>
                                {data.daily_breakdown
                                    .filter(
                                        (d) =>
                                            d.meal_count > 0 ||
                                            d.expense_count > 0,
                                    )
                                    .map((day) => (
                                        <div
                                            key={day.date}
                                            className="nl-table__row"
                                        >
                                            <span>
                                                {new Date(
                                                    day.date + "T00:00:00",
                                                ).toLocaleDateString("en", {
                                                    weekday: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            <span>{day.meal_count || "—"}</span>
                                            <span>
                                                {day.total_calories > 0
                                                    ? `${Number(day.total_calories).toFixed(0)} kcal`
                                                    : "—"}
                                            </span>
                                            <span
                                                className={
                                                    day.expense_total > 0
                                                        ? "nl-table__rose"
                                                        : ""
                                                }
                                            >
                                                {day.expense_total > 0
                                                    ? `$${Number(day.expense_total).toFixed(2)}`
                                                    : "—"}
                                            </span>
                                            <span>
                                                {day.expense_count || "—"}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
