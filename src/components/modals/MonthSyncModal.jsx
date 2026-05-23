import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function MonthSyncModal({ open, onClose, data, uid }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        feeExpense: data.feeExpense || 0,
      });
    }
  }, [data]);

  if (!open || !form) return null;

  // ✅ number formatter
  const formatNumber = (value) => {
    if (!value) return "0";

    return value
      .toString()
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleSave = async () => {
    if (!uid) return;

    const confirming = window.confirm(
      "Are you sure you want to save?"
    );

    if (!confirming) return;

    await setDoc(doc(db, "users", uid, "datas", form.month), {
      ...form,
      updatedAt: serverTimestamp(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-[340px] rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col gap-4">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-bold">
            Sync Month Data
          </h2>

          <p className="text-sm text-gray-500">
            Edit monthly summary manually if needed
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Month:{" "}
            <span className="text-black font-semibold">
              {form.month}
            </span>
          </p>
        </div>

        {/* TOTAL BALANCE */}
        <div>
          <p className="text-xs text-gray-500 mb-1">
            Total Balance Saat ini (Rp)
          </p>

          <input
            className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:border-black"
            value={formatNumber(form.totalBalance)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              handleChange("totalBalance", raw);
            }}
            placeholder="e.g. 5.500.000"
          />
        </div>

        {/* TOTAL INCOME */}
        <div>
          <p className="text-xs text-gray-500 mb-1">
            Total Income Bulan ini (Rp)
          </p>

          <input
            className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:border-black"
            value={formatNumber(form.totalIncome)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              handleChange("totalIncome", raw);
            }}
            placeholder="e.g. 7.000.000"
          />
        </div>

        {/* TOTAL EXPENSE */}
        <div>
          <p className="text-xs text-gray-500 mb-1">
            Total Expense Bulan ini (Rp)
          </p>

          <input
            className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:border-black"
            value={formatNumber(form.totalExpense)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              handleChange("totalExpense", raw);
            }}
            placeholder="e.g. 1.500.000"
          />
        </div>

        {/* FEE % */}
        <div>
          <p className="text-xs text-gray-500 mb-1">
            Fee Percentage (%)
          </p>

          <input
            className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:border-black"
            value={form.feePercent}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              handleChange("feePercent", raw);
            }}
            placeholder="e.g. 2.5"
          />
        </div>

        {/* FEE EXPENSE */}
        <div>
          <p className="text-xs text-gray-500 mb-1">
            Fee Expense Bulan ini (Rp)
          </p>

          <input
            className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:border-black"
            value={formatNumber(form.feeExpense)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              handleChange("feeExpense", raw);
            }}
            placeholder="e.g. 175.000"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-2">

          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-3 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex-1 bg-black text-white rounded-xl py-3 hover:bg-gray-800 transition"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}