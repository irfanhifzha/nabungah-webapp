import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";

import {
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

export default function ExchangeBalanceModal({
  open,
  onClose,
  wallets,
  quickAction,
}) {
  const [amount, setAmount] = useState("");
  const [walletIdAsal, setWalletIdAsal] = useState("");
  const [walletIdTujuan, setWalletIdTujuan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // RESET WHEN CLOSED
  useEffect(() => {
    if (!open) {
      setAmount("");
      setWalletIdAsal("");
      setWalletIdTujuan("");
      setError("");
      setLoading(false);
    }
  }, [open]);


  if (!open) return null;
  // add anim
  // const [show, setShow] = useState(open);

  // useEffect(() => {
  //   if (open) setShow(true);
  //   else {
  //     setTimeout(() => setShow(false), 200); // match animation duration
  //   }
  // }, [open]);

  // if (!show) return null;



  // FORMAT RP
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
        return;
      }

      const amt = Number(amount);

      if (!amt || amt <= 1000) {
        setError("Amount must be greater than 1.000");
        return;
      }

      if (!walletIdAsal || !walletIdTujuan) {
        setError("Please select both wallets");
        return;
      }

      if (walletIdAsal === walletIdTujuan) {
        setError("Wallet asal and tujuan cannot be the same");
        return;
      }

      setError("");

      

      // 🔥 FIRESTORE SOURCE OF TRUTH (FROM WALLET)
      const fromRef = doc(db, "users", uid, "wallets", walletIdAsal);
      const fromSnap = await getDoc(fromRef);

      if (!fromSnap.exists()) {
        setError("Source wallet not found");
        return;
      }

      const fromData = fromSnap.data();
      const fromBalance = Number(fromData.balance || 0);

      if (fromBalance < amt) {
        setError("Insufficient wallet balance");
        return;
      }

      const confirming = window.confirm(
        "Are you sure you want to save?"
      );
      if (!confirming) {
        setLoading(false);
        return;
      }

      // 🔥 FIRESTORE SOURCE OF TRUTH (TO WALLET)
      const toRef = doc(db, "users", uid, "wallets", walletIdTujuan);
      const toSnap = await getDoc(toRef);

      if (!toSnap.exists()) {
        setError("Destination wallet not found");
        return;
      }

      const toData = toSnap.data();
      const toBalance = Number(toData.balance || 0);

      // 🔥 UPDATE BOTH WALLETS
      await updateDoc(fromRef, {
        balance: fromBalance - amt,
        updatedAt: serverTimestamp(),
      });

      await updateDoc(toRef, {
        balance: toBalance + amt,
        updatedAt: serverTimestamp(),
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to process transfer");
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
            Tukar Uang
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Exchange balance antar media wallet
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

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

        {/* WALLET ASAL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Wallet Asal
          </label>

          <select
            value={walletIdAsal}
            onChange={(e) => setWalletIdAsal(e.target.value)}
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          >
            <option value="">Select Wallet</option>
            {wallets?.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        {/* WALLET TUJUAN */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">
            Wallet Tujuan
          </label>

          <select
            value={walletIdTujuan}
            onChange={(e) => setWalletIdTujuan(e.target.value)}
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-black"
          >
            <option value="">Select Wallet</option>
            {wallets?.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
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