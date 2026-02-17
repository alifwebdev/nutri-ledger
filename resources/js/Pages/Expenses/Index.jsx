import { useState, useEffect, useCallback } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useApi } from "@/hooks/useApi";

const CATEGORIES = {
    food: { label: "Food & Dining", icon: "🍜", color: "amber" },
    groceries: { label: "Groceries", icon: "🛒", color: "green" },
    transport: { label: "Transport", icon: "🚌", color: "sky" },
    utilities: { label: "Utilities", icon: "⚡", color: "yellow" },
    entertainment: { label: "Entertainment", icon: "🎬", color: "violet" },
    health: { label: "Health & Medical", icon: "💊", color: "rose" },
    shopping: { label: "Shopping", icon: "🛍", color: "pink" },
    other: { label: "Other", icon: "◎", color: "slate" },
};

const EMPTY = {
    title: "",
    amount: "",
    category: "other",
    notes: "",
    spent_at: new Date().toISOString().slice(0, 10),
};

/* ── Modal Form ── */
function ExpenseModal({ initial, onSave, onCancel, saving, saveError }) {
    const [form, setForm] = useState({ ...EMPTY, ...initial });
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    return (
        <div className="nl-backdrop">
            <div className="nl-modal">
                <h2 className="nl-modal__title">
                    {initial?.id ? "Edit Expense" : "Add Expense"}
                </h2>

                <label className="nl-label">Description *</label>
                <input
                    className="nl-input"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Coffee & snacks"
                    autoFocus
                />

                <label className="nl-label">Amount *</label>
                <div className="nl-input-prefix">
                    <span className="nl-input-prefix__symbol">$</span>
                    <input
                        className="nl-input nl-input--prefixed"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={form.amount}
                        onChange={(e) => set("amount", e.target.value)}
                        placeholder="0.00"
                    />
                </div>

                <label className="nl-label">Category *</label>
                <div className="nl-cat-grid">
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => set("category", key)}
                            className={`nl-cat-btn nl-cat-btn--${cat.color} ${form.category === key ? "nl-cat-btn--active" : ""}`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                <label className="nl-label">Date *</label>
                <input
                    className="nl-input"
                    type="date"
                    value={form.spent_at}
                    onChange={(e) => set("spent_at", e.target.value)}
                />

                <label className="nl-label">Notes (optional)</label>
                <textarea
                    className="nl-textarea"
                    rows={2}
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Any details…"
                />

                {saveError && (
                    <div
                        style={{
                            marginTop: "14px",
                            padding: "10px 14px",
                            background: "#ffe4e6",
                            color: "#e11d48",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 500,
                        }}
                    >
                        ⚠ {saveError}
                    </div>
                )}

                <div className="nl-modal__actions">
                    <button className="nl-btn nl-btn--ghost" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className="nl-btn nl-btn--primary"
                        disabled={
                            saving ||
                            !form.title ||
                            !form.amount ||
                            !form.spent_at
                        }
                        onClick={() => onSave(form)}
                    >
                        {saving
                            ? "Saving…"
                            : initial?.id
                              ? "Update"
                              : "Add Expense"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Expense Row ── */
function ExpenseRow({ expense, onEdit, onDelete }) {
    const cat = CATEGORIES[expense.category] ?? CATEGORIES.other;
    return (
        <div className={`nl-row nl-row--${cat.color}`}>
            <span className="nl-row__icon">{cat.icon}</span>
            <div className="nl-row__info">
                <span className="nl-row__title">{expense.title}</span>
                <span className="nl-row__meta">
                    {cat.label}
                    {expense.notes ? ` · ${expense.notes}` : ""}
                </span>
            </div>
            <span className="nl-row__amount">
                ${Number(expense.amount).toFixed(2)}
            </span>
            <div className="nl-row__actions">
                <button
                    className="nl-icon-btn"
                    onClick={() => onEdit(expense)}
                    title="Edit"
                >
                    ✎
                </button>
                <button
                    className="nl-icon-btn nl-icon-btn--danger"
                    onClick={() => onDelete(expense.id)}
                    title="Delete"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

/* ── Helper: unwrap Laravel API Resource collections ── */
const unwrap = (res) => (Array.isArray(res) ? res : (res?.data ?? []));

/* ── Page ── */
export default function ExpensesIndex({ auth }) {
    const { get, post, put, del, loading, error } = useApi();
    const [expenses, setExpenses] = useState([]);
    const [viewMode, setViewMode] = useState("day");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [yearMonth, setYearMonth] = useState(
        new Date().toISOString().slice(0, 7),
    );
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const load = useCallback(() => {
        const params =
            viewMode === "day"
                ? { date }
                : {
                      year: yearMonth.split("-")[0],
                      month: yearMonth.split("-")[1],
                  };
        get("/expenses", params)
            .then((res) => setExpenses(unwrap(res)))
            .catch(() => {});
    }, [viewMode, date, yearMonth]);

    useEffect(() => {
        load();
    }, [load]);

    const openCreate = () => {
        setEditing(null);
        setSaveError(null);
        setShowForm(true);
    };
    const openEdit = (e) => {
        setEditing({ ...e, spent_at: e.spent_at.slice(0, 10) });
        setSaveError(null);
        setShowForm(true);
    };
    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
        setSaveError(null);
    };

    const handleSave = async (form) => {
        setSaving(true);
        setSaveError(null);
        try {
            if (editing?.id) {
                const res = await put(`/expenses/${editing.id}`, form);
                const updated = res?.data ?? res;
                setExpenses((es) =>
                    es.map((e) => (e.id === updated.id ? updated : e)),
                );
            } else {
                await post("/expenses", form);
                load();
            }
            closeForm();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                Object.values(err.response?.data?.errors ?? {})[0]?.[0] ||
                "Failed to save expense.";
            setSaveError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense?")) return;
        await del(`/expenses/${id}`);
        setExpenses((es) => es.filter((e) => e.id !== id));
    };

    const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

    const byCat = Object.entries(CATEGORIES)
        .map(([key, cat]) => {
            const items = expenses.filter((e) => e.category === key);
            return items.length
                ? {
                      key,
                      cat,
                      total: items.reduce(
                          (s, e) => s + parseFloat(e.amount),
                          0,
                      ),
                  }
                : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.total - a.total);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="nl-page-title">Expenses</h2>}
        >
            <Head title="Expenses" />

            {showForm && (
                <ExpenseModal
                    initial={editing}
                    onSave={handleSave}
                    onCancel={closeForm}
                    saving={saving}
                    saveError={saveError}
                />
            )}

            <div className="nl-page">
                {/* Controls */}
                <div className="nl-controls">
                    <div className="nl-toggle">
                        <button
                            className={`nl-toggle__btn ${viewMode === "day" ? "nl-toggle__btn--active" : ""}`}
                            onClick={() => setViewMode("day")}
                        >
                            Day
                        </button>
                        <button
                            className={`nl-toggle__btn ${viewMode === "month" ? "nl-toggle__btn--active" : ""}`}
                            onClick={() => setViewMode("month")}
                        >
                            Month
                        </button>
                    </div>
                    {viewMode === "day" ? (
                        <input
                            type="date"
                            className="nl-input nl-input--inline"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    ) : (
                        <input
                            type="month"
                            className="nl-input nl-input--inline"
                            value={yearMonth}
                            onChange={(e) => setYearMonth(e.target.value)}
                        />
                    )}
                    <button
                        className="nl-btn nl-btn--primary"
                        onClick={openCreate}
                    >
                        + Add Expense
                    </button>
                </div>

                {/* Total banner */}
                <div className="nl-banner">
                    <div>
                        <div className="nl-banner__label">
                            {viewMode === "day" ? "Today" : "Month"} Total
                        </div>
                        <div className="nl-banner__amount">
                            ${total.toFixed(2)}
                        </div>
                    </div>
                    <div className="nl-banner__count">
                        {expenses.length} transactions
                    </div>
                </div>

                {/* Category chips */}
                {byCat.length > 0 && (
                    <div className="nl-pills">
                        {byCat.map(({ key, cat, total: t }) => (
                            <span
                                key={key}
                                className={`nl-pill nl-pill--${cat.color}`}
                            >
                                {cat.icon} {cat.label} — ${t.toFixed(2)}
                            </span>
                        ))}
                    </div>
                )}

                {/* Loading / Empty */}
                {loading && <p className="nl-loading">Loading…</p>}
                {!loading && expenses.length === 0 && (
                    <div className="nl-empty">
                        <span className="nl-empty__icon">💸</span>
                        <p>No expenses for this period.</p>
                        <button
                            className="nl-btn nl-btn--primary"
                            onClick={openCreate}
                        >
                            Add your first expense
                        </button>
                    </div>
                )}

                {/* List */}
                <div className="nl-list">
                    {expenses.map((exp) => (
                        <ExpenseRow
                            key={exp.id}
                            expense={exp}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
