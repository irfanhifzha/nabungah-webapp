import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export default function AddWalletModal({
  open,
  onClose,
}) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 RESET WHEN CLOSED
  useEffect(() => {
    if (!open) {
      setName("");
      setBalance("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  // 🔥 FORMAT NUMBER
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setError("User not authenticated");
        return;
      }

      const bal = Number(balance);

      // 🔥 VALIDATION
      if (!name.trim()) {
        setError("Wallet name is required");
        return;
      }

      if (bal < 0) {
        setError("Balance cannot be negative");
        return;
      }

      setError("");

      // 🔥 CREATE WALLET
      await addDoc(
        collection(db, "users", uid, "wallets"),
        {
          name: name.trim(),
          balance: bal,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      onClose();

    } catch (err) {
      console.error(err);
      setError("Failed to create wallet");
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
            Add Wallet
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Create new wallet balance
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Wallet Name
          </label>

          <input
            type="text"
            placeholder="Cash / Dana"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          />
        </div>

        {/* BALANCE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Starting Balance (Rp)
          </label>

          <input
            type="text"
            inputMode="numeric"
            placeholder="1.000.000"
            value={formatNumber(balance)}
            onChange={(e) => {
              const raw = e.target.value.replace(
                /\D/g,
                ""
              );

              setBalance(raw);
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