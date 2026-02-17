import { useState, useEffect, useCallback } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useApi } from "@/hooks/useApi";

const TYPES = ["breakfast", "lunch", "dinner", "snack"];
const TYPE_ICON = { breakfast: "☀", lunch: "☁", dinner: "🌙", snack: "✦" };
const TYPE_COLOR = {
    breakfast: "amber",
    lunch: "sky",
    dinner: "violet",
    snack: "green",
};

const EMPTY = {
    name: "",
    type: "lunch",
    notes: "",
    calories: "",
    eaten_at: new Date().toISOString().slice(0, 10),
};

/* ── Modal Form ── */
function MealModal({ initial, onSave, onCancel, saving }) {
    const [form, setForm] = useState({ ...EMPTY, ...initial });
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    return (
        <div className="nl-backdrop">
            <div className="nl-modal">
                <h2 className="nl-modal__title">
                    {initial?.id ? "Edit Meal" : "Log a Meal"}
                </h2>

                <label className="nl-label">Meal Name *</label>
                <input
                    className="nl-input"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Grilled Chicken Salad"
                    autoFocus
                />

                <label className="nl-label">Type *</label>
                <div className="nl-type-grid">
                    {TYPES.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => set("type", t)}
                            className={`nl-type-btn nl-type-btn--${TYPE_COLOR[t]} ${form.type === t ? "nl-type-btn--active" : ""}`}
                        >
                            {TYPE_ICON[t]}&nbsp;
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                <label className="nl-label">Date *</label>
                <input
                    className="nl-input"
                    type="date"
                    value={form.eaten_at}
                    onChange={(e) => set("eaten_at", e.target.value)}
                />

                <label className="nl-label">Calories (optional)</label>
                <input
                    className="nl-input"
                    type="number"
                    min="0"
                    value={form.calories}
                    onChange={(e) => set("calories", e.target.value)}
                    placeholder="e.g. 450"
                />

                <label className="nl-label">Notes (optional)</label>
                <textarea
                    className="nl-textarea"
                    rows={2}
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Any details…"
                />

                <div className="nl-modal__actions">
                    <button className="nl-btn nl-btn--ghost" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className="nl-btn nl-btn--primary"
                        disabled={saving || !form.name || !form.eaten_at}
                        onClick={() => onSave(form)}
                    >
                        {saving
                            ? "Saving…"
                            : initial?.id
                              ? "Update"
                              : "Log Meal"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Meal Row ── */
function MealRow({ meal, onEdit, onDelete }) {
    const color = TYPE_COLOR[meal.type] ?? "amber";
    return (
        <div className={`nl-row nl-row--${color}`}>
            <span className="nl-row__icon">{TYPE_ICON[meal.type]}</span>
            <div className="nl-row__info">
                <span className="nl-row__title">{meal.name}</span>
                <span className="nl-row__meta">
                    {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                    {meal.calories
                        ? ` · ${Number(meal.calories).toFixed(0)} kcal`
                        : ""}
                    {meal.notes ? ` · ${meal.notes}` : ""}
                </span>
            </div>
            <div className="nl-row__actions">
                <button
                    className="nl-icon-btn"
                    onClick={() => onEdit(meal)}
                    title="Edit"
                >
                    ✎
                </button>
                <button
                    className="nl-icon-btn nl-icon-btn--danger"
                    onClick={() => onDelete(meal.id)}
                    title="Delete"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

/* ── Page ── */
export default function MealsIndex({ auth }) {
    const { get, post, put, del, loading } = useApi();
    const [meals, setMeals] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        get("/meals", { date })
            .then((res) =>
                setMeals(Array.isArray(res) ? res : (res?.data ?? [])),
            )
            .catch(() => {});
    }, [date]);

    useEffect(() => {
        load();
    }, [load]);

    const openCreate = () => {
        setEditing(null);
        setShowForm(true);
    };
    const openEdit = (m) => {
        setEditing({ ...m, eaten_at: m.eaten_at.slice(0, 10) });
        setShowForm(true);
    };
    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
    };

    const handleSave = async (form) => {
        setSaving(true);
        try {
            if (editing?.id) {
                const res = await put(`/meals/${editing.id}`, form);
                const updated = res?.data ?? res;
                setMeals((ms) =>
                    ms.map((m) => (m.id === updated.id ? updated : m)),
                );
            } else {
                const res = await post("/meals", form);
                const created = res?.data ?? res;
                if (created.eaten_at?.slice(0, 10) === date) {
                    setMeals((ms) => [created, ...ms]);
                } else {
                    load();
                }
            }
            closeForm();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                Object.values(err.response?.data?.errors ?? {})[0]?.[0] ||
                "Failed to save meal.";
            alert(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this meal?")) return;
        await del(`/meals/${id}`);
        setMeals((ms) => ms.filter((m) => m.id !== id));
    };

    const byType = TYPES.reduce(
        (acc, t) => ({ ...acc, [t]: meals.filter((m) => m.type === t) }),
        {},
    );
    const totalCal = meals.reduce(
        (s, m) => s + (parseFloat(m.calories) || 0),
        0,
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="nl-page-title">Meals</h2>}
        >
            <Head title="Meals" />

            {showForm && (
                <MealModal
                    initial={editing}
                    onSave={handleSave}
                    onCancel={closeForm}
                    saving={saving}
                />
            )}

            <div className="nl-page">
                {/* Controls */}
                <div className="nl-controls">
                    <input
                        type="date"
                        className="nl-input nl-input--inline"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <button
                        className="nl-btn nl-btn--primary"
                        onClick={openCreate}
                    >
                        + Log Meal
                    </button>
                </div>

                {/* Summary pills */}
                {meals.length > 0 && (
                    <div className="nl-pills">
                        <span className="nl-pill nl-pill--neutral">
                            {meals.length} meals
                        </span>
                        {totalCal > 0 && (
                            <span className="nl-pill nl-pill--green">
                                {totalCal.toFixed(0)} kcal
                            </span>
                        )}
                        {TYPES.filter((t) => byType[t].length > 0).map((t) => (
                            <span
                                key={t}
                                className={`nl-pill nl-pill--${TYPE_COLOR[t]}`}
                            >
                                {TYPE_ICON[t]} {byType[t].length} {t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Loading */}
                {loading && <p className="nl-loading">Loading…</p>}

                {/* Empty */}
                {!loading && meals.length === 0 && (
                    <div className="nl-empty">
                        <span className="nl-empty__icon">🍽</span>
                        <p>No meals logged for this day.</p>
                        <button
                            className="nl-btn nl-btn--primary"
                            onClick={openCreate}
                        >
                            Log your first meal
                        </button>
                    </div>
                )}

                {/* Grouped by type */}
                {TYPES.filter((t) => byType[t].length > 0).map((t) => (
                    <div key={t} className="nl-group">
                        <h3
                            className={`nl-group__heading nl-group__heading--${TYPE_COLOR[t]}`}
                        >
                            {TYPE_ICON[t]}&nbsp;
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </h3>
                        {byType[t].map((meal) => (
                            <MealRow
                                key={meal.id}
                                meal={meal}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
