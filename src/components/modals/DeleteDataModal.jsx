import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import { doc, deleteDoc, writeBatch } from "firebase/firestore";

export default function DeleteDataModal({
  open,
  onClose,
  monthlyData,
}) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelected(null);
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const uid = auth.currentUser?.uid;

  // =========================
  // DELETE ONE
  // =========================
  const handleDeleteOne = async () => {
    setError("");

    if (!selected) {
      setError("Please select a month first");
      return;
    }

    if (!uid) {
      setError("User not authenticated");
      return;
    }

    const confirmDelete = window.confirm(
      `Delete snapshot for "${selected.month}"?`
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      await deleteDoc(
        doc(db, "users", uid, "datas", selected.id)
      );

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE ALL
  // =========================
  const handleDeleteAll = async () => {
    setError("");

    if (!monthlyData?.length) {
      setError("No data to delete");
      return;
    }

    if (!uid) {
      setError("User not authenticated");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete ALL monthly snapshots?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const batch = writeBatch(db);

      monthlyData.forEach((m) => {
        const ref = doc(db, "users", uid, "datas", m.id);
        batch.delete(ref);
      });

      await batch.commit();

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete all data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[340px] rounded-[28px] p-5 shadow flex flex-col gap-4">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-bold">Delete Monthly Data</h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a month or delete all snapshots
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* LIST */}
        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
          {!monthlyData?.length && (
            <p className="text-sm text-gray-400">
              No monthly data available
            </p>
          )}

          {monthlyData?.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className={`text-left p-3 rounded-xl border transition ${
                selected?.id === m.id
                  ? "border-black bg-gray-100"
                  : "border-gray-200"
              }`}
            >
              <p className="font-semibold text-sm">{m.month}</p>

              <p className="text-xs text-gray-500">
                Balance: Rp{" "}
                {Number(m.totalBalance || 0).toLocaleString("id-ID")}
              </p>
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2 mt-2">

          {monthlyData?.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={loading}
              className="w-full border border-red-500 text-red-500 rounded-xl p-3 disabled:opacity-50"
            >
              Delete All
            </button>
          )}

          <div className="flex gap-2">

            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-xl p-3 text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteOne}
              disabled={loading || !selected}
              className="flex-1 bg-black text-white rounded-xl p-3 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}