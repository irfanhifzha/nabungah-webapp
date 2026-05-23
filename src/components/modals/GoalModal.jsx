import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export default function GoalModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // RESET WHEN CLOSED
  useEffect(() => {
    if (!open) {
      setTitle("");
      setTargetAmount("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  // FORMAT NUMBER
  const formatNumber = (value) => {
    if (!value) return "";
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

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

      if (!title.trim()) {
        setError("Goal title is required");
        setLoading(false);
        return;
      }

      if (!target || target <= 0) {
        setError("Target amount must be greater than 0");
        setLoading(false);
        return;
      }

      setError("");

      await addDoc(collection(db, "users", uid, "goals"), {
        title: title.trim(),
        targetAmount: target,
        savedAmount: 0,
        status: "in_progress",
        createdAt: serverTimestamp(),
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create goal");
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
            Create Goal
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Set your savings target
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
            onChange={(e) => setTitle(e.target.value)}
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
            placeholder="25.000.000"
            value={formatNumber(targetAmount)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setTargetAmount(raw);
            }}
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-2">

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
            {loading ? "Loading..." : "Save"}
          </button>

        </div>

      </div>
    </div>
  );
}