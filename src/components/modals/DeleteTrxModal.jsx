import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";

import {
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

export default function DeleteTrxModal({
  open,
  onClose,
  transactions,
}) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleDeleteOne = async () => {
    setLoading(true);
    setError("");

    if (!selected) {
      setError("Select transaction first");
      setLoading(false);
      return;
    }

    const confirmDelete = window.confirm(
      `Delete transaction "${selected.title}"?`
    );

    if (!confirmDelete) {
      setLoading(false);
      return;
    }

    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setError("User not authenticated");
        return;
      }

      await deleteDoc(
        doc(db, "users", uid, "transactions", selected.id)
      );

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    setError("");

    if (transactions.length === 0) {
      setLoading(false);
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete ALL transactions?"
    );

    if (!confirmDelete) {
      setLoading(false);
      return;
    }

    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setError("User not authenticated");
        return;
      }

      const batch = writeBatch(db);

      transactions.forEach((t) => {
        const ref = doc(db, "users", uid, "transactions", t.id);
        batch.delete(ref);
      });

      await batch.commit();

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete all transactions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-[340px] rounded-[28px] p-5 shadow flex flex-col gap-4">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-bold">
            Delete Transactions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Select one or delete all transactions
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* LIST */}
        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">

          {transactions.length === 0 && (
            <p className="text-sm text-gray-400">
              No transactions
            </p>
          )}

          {transactions.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className={`text-left p-3 rounded-xl border transition ${
                selected?.id === t.id
                  ? "border-black bg-gray-100"
                  : "border-gray-200"
              }`}
            >
              <p className="font-semibold text-sm">
                {t.title}
              </p>

              <p className={`text-xs ${
                t.type === "income"
                  ? "text-green-600"
                  : "text-red-500"
              }`}>
                {t.type} • Rp{" "}
                {Number(t.amount).toLocaleString("id-ID")}
              </p>
            </button>
          ))}

        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2 mt-2">

          {transactions.length > 0 && (
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