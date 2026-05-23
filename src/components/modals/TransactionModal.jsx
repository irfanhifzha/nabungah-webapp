import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

export default function TransactionModal({
  open,
  onClose,
  wallets,
  quickAction,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [walletId, setWalletId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 AUTO PREFILL FROM QUICK ACTION
  useEffect(() => {
    if (quickAction) {
      setTitle(quickAction.title || "");
      setAmount(String(quickAction.amount || ""));
      setType(quickAction.type || "expense");
    }
  }, [quickAction]);

  // 🔥 RESET WHEN CLOSED
  useEffect(() => {
    if (!open) {
      setTitle("");
      setAmount("");
      setType("expense");
      setWalletId("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  // 🔥 FORMAT RP
  const formatNumber = (value) => {
    if (!value) return "";

    const numberString = value.toString().replace(/\D/g, "");

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

      const amt = Number(amount);

      // 🔥 VALIDATION
      if (!title.trim()) {
        setError("Title is required");
        return;
      }

      if (amt <= 0) {
        setError("Amount must be greater than 0");
        return;
      }

      if (!walletId) {
        setError("Please select wallet");
        return;
      }

      setError("");

    // 🔥 CHECK WALLET BALANCE FIRST
        const selectedWallet = wallets.find(
        (w) => w.id === walletId
        );

        if (!selectedWallet) {
        setError("Wallet not found");
        return;
        }

        const currentBalance = Number(selectedWallet.balance || 0);

        const newBalance =
        type === "income"
            ? currentBalance + amt
            : currentBalance - amt;

        // OPTIONAL: block negative
        if (newBalance < 0) {
            setError("Insufficient wallet balance");
            return;
        }

      // 🔥 DATE INFO
      const now = new Date();

      const month = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      const year = now.getFullYear();

      // 🔥 CREATE TRANSACTION
      await addDoc(
        collection(db, "users", uid, "transactions"),
        {
          title: title.trim(),
          amount: amt,
          type,
          walletId,
          note: "",
          month,
          year,
          date: serverTimestamp(),
          createdAt: serverTimestamp(),
        }
      );



      // 🔥 UPDATE WALLET BALANCE
      const walletRef = doc(
        db,
        "users",
        uid,
        "wallets",
        walletId
      );

      await updateDoc(walletRef, {
        balance: newBalance,
        updatedAt: serverTimestamp(),
      });

      onClose();

    } catch (err) {
      console.error(err);
      setError("Failed to create transaction");
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
            New Transaction
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Add income or expense
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
            Title
          </label>

          <input
            type="text"
            placeholder="Isi Bensin"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          />
        </div>

        {/* AMOUNT */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Amount (Rp)
          </label>

          <input
            type="text"
            inputMode="numeric"
            placeholder="20.000"
            value={formatNumber(amount)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setAmount(raw);
            }}
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          />
        </div>

        {/* TYPE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          >
            <option value="expense">
              Expense (-)
            </option>

            <option value="income">
              Income (+)
            </option>

          </select>
        </div>

        {/* WALLET */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Wallet
          </label>

          <select
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          >
            <option value="">
              Select Wallet
            </option>

            {wallets?.map((wallet) => (
              <option
                key={wallet.id}
                value={wallet.id}
              >
                {wallet.name}
              </option>
            ))}
          </select>
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