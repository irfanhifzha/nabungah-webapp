import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";

import {
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function EditGoalModal({
  open,
  onClose,
  goal,
}) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [status, setStatus] = useState("in_progress");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PREFILL
  useEffect(() => {
    if (goal && open) {
      setTitle(goal.title || "");
      setTargetAmount(
        String(goal.targetAmount || "")
      );
      setSavedAmount(
        String(goal.savedAmount || "")
      );
      setStatus(goal.status || "in_progress");
    }
  }, [goal, open]);

  // RESET WHEN CLOSED
  useEffect(() => {
    if (!open) {
      setTitle("");
      setTargetAmount("");
      setSavedAmount("");
      setStatus("in_progress");
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open || !goal) return null;

  // FORMAT NUMBER
  const formatNumber = (value) => {
    if (!value) return "";

    const numberString = value
      .toString()
      .replace(/\D/g, "");

    return numberString.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );
  };

  // UPDATE GOAL
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const target = Number(targetAmount || 0);
      const saved = Number(savedAmount || 0);

      // VALIDATION
      if (!title.trim()) {
        setError("Goal title is required");
        setLoading(false);
        return;
      }

      if (!target || target <= 0) {
        setError(
          "Target amount must be greater than 0"
        );
        setLoading(false);
        return;
      }

      if (saved < 0) {
        setError(
          "Saved amount cannot be negative"
        );
        setLoading(false);
        return;
      }

      setError("");

      const goalRef = doc(
        db,
        "users",
        uid,
        "goals",
        goal.id
      );

      await updateDoc(goalRef, {
        title: title.trim(),
        targetAmount: target,
        savedAmount: saved,
        status,
        updatedAt: serverTimestamp(),
      });

      onClose();

    } catch (err) {
      console.error(err);
      setError("Failed to update goal");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE GOAL
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this goal?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const goalRef = doc(
        db,
        "users",
        uid,
        "goals",
        goal.id
      );

      await deleteDoc(goalRef);

      onClose();

    } catch (err) {
      console.error(err);
      setError("Failed to remove goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-[340px] rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col gap-4">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-bold text-black">
            Edit Goal
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update your savings target
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* TITLE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Goal Title
          </label>

          <input
            type="text"
            placeholder="MacBook M3"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          />
        </div>

        {/* TARGET */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Target Amount (Rp)
          </label>

          <input
            type="text"
            inputMode="numeric"
            placeholder="1.000.000"
            value={formatNumber(targetAmount)}
            onChange={(e) => {
              const raw = e.target.value.replace(
                /\D/g,
                ""
              );

              setTargetAmount(raw);
            }}
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          />
        </div>

        {/* SAVED */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Saved Amount (Rp)
          </label>

          <input
            type="text"
            inputMode="numeric"
            placeholder="200.000"
            value={formatNumber(savedAmount)}
            onChange={(e) => {
              const raw = e.target.value.replace(
                /\D/g,
                ""
              );

              setSavedAmount(raw);
            }}
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          />
        </div>

        {/* STATUS */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          >
            <option value="in_progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-2">

          <button
            onClick={handleDelete}
            disabled={loading}
            className="border border-red-200 text-red-500 rounded-xl px-4 hover:bg-red-50 transition"
          >
            Remove
          </button>

          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl p-3 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-black text-white rounded-xl p-3 hover:bg-gray-800 transition"
          >
            {loading ? "Loading..." : "Update"}
          </button>

        </div>

      </div>
    </div>
  );
}