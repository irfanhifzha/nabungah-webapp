import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";

import {
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

export default function DeleteQAModal({
  open,
  onClose,
  quickActions,
}) {
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedId("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleDeleteOne = async () => {
    setLoading(true);

    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      if (!selectedId) {
        setError("Select quick action first");
        setLoading(false);
        return;
      }

      await deleteDoc(
        doc(db, "users", uid, "quickactions", selectedId)
      );

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);

    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const batch = writeBatch(db);

      quickActions.forEach((q) => {
        const ref = doc(db, "users", uid, "quickactions", q.id);
        batch.delete(ref);
      });

      await batch.commit();

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete all");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-[340px] rounded-[28px] p-5 shadow flex flex-col gap-4">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-bold">Delete Quick Actions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Select or delete all items
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
          {quickActions.length === 0 && (
            <p className="text-sm text-gray-400">
              No quick actions
            </p>
          )}

          {quickActions.map((q) => (
            <button
              key={q.id}
              onClick={() => setSelectedId(q.id)}
              className={`text-left p-3 rounded-xl border transition ${
                selectedId === q.id
                  ? "border-black bg-gray-100"
                  : "border-gray-200"
              }`}
            >
              <p className="font-semibold text-sm">{q.title}</p>
              <p className="text-xs text-gray-500">
                {q.type} • Rp {Number(q.amount).toLocaleString("id-ID")}
              </p>
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2 mt-2">

          <button
            onClick={handleDeleteAll}
            disabled={loading}
            className="w-full bg-red-600 text-white rounded-xl p-3"
          >
            Delete All
          </button>

          <div className="flex gap-2">

            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-xl p-3 text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteOne}
              disabled={loading}
              className="flex-1 bg-black text-white rounded-xl p-3"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}