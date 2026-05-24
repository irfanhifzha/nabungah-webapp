import Logos from "../assets/icon.png";

import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  doc,
} from "firebase/firestore";

// MODALS
import AddWalletModal from "../components/modals/AddWalletModal";
import QuickActionModal from "../components/modals/QuickActionModal";
import TransactionModal from "../components/modals/TransactionModal";
import MonthSyncModal from "../components/modals/MonthSyncModal";
import ExchangeBalanceModal from "../components/modals/ExchangeBalanceModal";
import GoalModal from "../components/modals/GoalModal";
import EditGoalModal from "../components/modals/EditGoalModal";
import DeleteQAModal from "../components/modals/DeleteQAModal";
import DeleteTrxModal from "../components/modals/DeleteTrxModal";
import DeleteWalletModal from "../components/modals/DeleteWalletModal";
import DeleteDataModal from "../components/modals/DeleteDataModal";

export default function Dashboard() {
  const [uid, setUid] = useState(null);
  const [username, setUsername] = useState(null);

  const [wallets, setWallets] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // MODALS
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [showTrxModal, setShowTrxModal] = useState(false);
  const [showExchangeBalanceModal, setShowExchangeBalanceModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [showDeleteQAModal, setShowDeleteQAModal] = useState(false);
  const [showDeleteTrxModal, setShowDeleteTrxModal] = useState(false);
  const [showDeleteWalletModal, setShowDeleteWalletModal] = useState(false);
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false);

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedQuickAction, setSelectedQuickAction] = useState(null);

  const [copiedId, setCopiedId] = useState(null);

  // filter recent transaction
  const [trxMonthFilter, setTrxMonthFilter] = useState("all");
  const [trxTypeFilter, setTrxTypeFilter] = useState("all");
  const [trxLimit, setTrxLimit] = useState(10);

  const filteredTransactions = useMemo(() => {
  return transactions.filter((t) => {
      if (!t.date?.toDate) return false;

      const d = t.date.toDate();
      const monthId = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      const matchMonth =
        trxMonthFilter === "all" || monthId === trxMonthFilter;

      const matchType =
        trxTypeFilter === "all" || t.type === trxTypeFilter;

      return matchMonth && matchType;
    });
  }, [transactions, trxMonthFilter, trxTypeFilter]);

  const displayedTransactions = useMemo(() => {
    return filteredTransactions.slice(0, trxLimit);
  }, [filteredTransactions, trxLimit]);

  const availableMonths = useMemo(() => {
  const set = new Set();

  transactions.forEach((t) => {
      if (!t.date?.toDate) return;

      const d = t.date.toDate();
      const id = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      set.add(id);
    });

    return ["all", ...Array.from(set).sort().reverse()];
  }, [transactions]);




  // =========================
  // COPY TO CLIPBOARD
  // =========================
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // alert("Copied ✅");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // FORMAT TRANSACTION
  const formatTransaction = (trx, walletName = "Unknown Wallet") => {
    const date = trx.date?.toDate ? trx.date.toDate() : new Date(trx.date);

    return `
*🧾 Transaksi Title: ${trx.title}*
💰 Amount: Rp ${Number(trx.amount).toLocaleString("id-ID")}
📌 Type: ${trx.type}
🏦 Wallet: ${walletName}
🗓️ Date: ${date.toLocaleString("id-ID", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
📝 Note: ${trx.note || "-"}
    `.trim();
      };

      // FORMAT MONTHLY DATA
    const formatMonthlyData = (m) => {
    return `
*📅 Data Statistik Bulan: ${m.month}*
💰 Total Income: Rp ${Number(m.totalIncome || 0).toLocaleString("id-ID")}
💸 Total Expense: Rp ${Number(m.totalExpense || 0).toLocaleString("id-ID")}
💼 Total Balance: Rp ${Number(m.totalBalance || 0).toLocaleString("id-ID")}
💳 Fee (${m.feePercent}%): Rp ${Number(m.feeExpense || 0).toLocaleString("id-ID")}
🕒 Updated: ${m.updatedAt?.toDate?.()?.toLocaleString("id-ID") || "-"}
    `.trim();
      };

  // AUTH
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUid(user ? user.uid : null);
    });

    return () => unsub();
  }, []);

  // offline mode firestore
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // FIRESTORE
  useEffect(() => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);

    const unsubUser = onSnapshot(userRef, (snap) => {
      setUsername(snap.exists() ? snap.data().name : "User");
    });

    const walletRef = collection(db, "users", uid, "wallets");
    const qaRef = collection(db, "users", uid, "quickactions");
    const goalRef = collection(db, "users", uid, "goals");

    const trxRef = query(
      collection(db, "users", uid, "transactions"),
      orderBy("date", "desc"),
    );

    const datasRef = collection(db, "users", uid, "datas");

    const unsubWallets = onSnapshot(walletRef, (snap) => {
      setWallets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubQA = onSnapshot(qaRef, (snap) => {
      setQuickActions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubTrx = onSnapshot(trxRef, (snap) => {
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubGoal = onSnapshot(goalRef, (snap) => {
      setGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubDatas = onSnapshot(datasRef, (snap) => {
      setMonthlyData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUser();
      unsubWallets();
      unsubQA();
      unsubTrx();
      unsubGoal();
      unsubDatas();
      };
    }, [uid]);

    const handleLogout = async () => {
      await signOut(auth);
    };

    const now = new Date();
    const monthId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const totalBalance = useMemo(
      () => wallets.reduce((acc, w) => acc + Number(w.balance || 0), 0),
      [wallets]
    );

    const monthlyTransactions = useMemo(() => {
      return transactions.filter((t) => {
        if (!t.date?.toDate) return false;
        const d = t.date.toDate();
        const id = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return id === monthId;
      });
    }, [transactions, monthId]);

    const totalIncome = useMemo(
      () =>
        monthlyTransactions
          .filter((t) => t.type === "income")
          .reduce((a, t) => a + Number(t.amount || 0), 0),
      [monthlyTransactions]
    );

    const totalExpense = useMemo(
      () =>
        monthlyTransactions
          .filter((t) => t.type === "expense")
          .reduce((a, t) => a + Number(t.amount || 0), 0),
      [monthlyTransactions]
    );

    const [feePercent, setFeePercent] = useState(2.5);

    const feeExpense = useMemo(
      () => Math.round((totalIncome * feePercent) / 100),
      [totalIncome, feePercent]
    );

    const [showMonthSyncModal, setShowMonthSyncModal] = useState(false);

    const sortedMonthlyData = useMemo(() => {
      return [...monthlyData].sort((a, b) => (a.month < b.month ? 1 : -1));
    }, [monthlyData]);

    const monthDataForSync = {
      month: monthId,
      totalBalance,
      totalIncome,
      totalExpense,
      feePercent,
      feeExpense,
    };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex justify-center items-center p-4">

      <div className="w-[390px] min-h-[844px] bg-white rounded-[38px] p-5 shadow flex flex-col gap-5">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <img src={Logos} className="h-[30px]"></img>
            <p className="text-sm text-gray-500">Halo <span className="font-bold">{username}</span> 👋</p>

            {!isOnline && (
            <div className="text-[10px] text-red-500 border border-gray-500 rounded-2xl p-2 mt-2">
              You're offline — showing cached data
            </div>
            )}
            


          </div>

         
            
         

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-black text-white rounded-xl active:scale-95"
          >
            Logout
          </button>
        </div>
        

        {/* WALLETS */}
        <section className="border rounded-2xl p-4">

          <div className="flex justify-between mb-3">
            <h2 className="font-bold me-18">Wallets</h2>

            <button className="bg-white border border-gray-600 text-white text-xs px-2 py-1 rounded-full select-none active:scale-95"
            onClick={() => {
              setShowDeleteWalletModal(true);
            }}>
              🗑️
            </button>
            {/* sampah or trash */}


            <button
              onClick={() => setShowExchangeBalanceModal(true)}
              className="text-xs bg-black text-white px-3 py-1 rounded-full active:scale-95"
            >
              ⇄ Tukar Uang
            </button>
          </div>


          {wallets.length === 0 && (
            <p className="text-sm text-gray-400">No wallet yet</p>
          )}

          {wallets.map((w) => (
            <div key={w.id} className="mb-3">
              <p className="text-sm text-gray-500">{w.name}</p>
              <h1 className="text-2xl font-bold">
                Rp {Number(w.balance || 0).toLocaleString("id-ID")}
              </h1>
            </div>
          ))}

          <button
            onClick={() => setShowWalletModal(true)}
            className="w-full mt-3 bg-black text-white py-2 rounded-xl active:scale-95"
          >
            + Add Wallet
          </button>
        </section>

        {/* GOALS NABUNG */}
        <section className="border rounded-2xl p-4">
          <div className="flex justify-between mb-3">
            <h2 className="font-bold">Nabung</h2>
            
            <button
              onClick={() => setShowGoalModal(true)}
              className="text-xs bg-black text-white px-3 py-1 rounded-full active:scale-95"
            >
              + Goal
            </button>
          </div>

          

          {goals.length === 0 && (
            <p className="text-sm text-gray-400">No Goals Nabung yet</p>
          )}

          <div className="grid gap-3">
            {goals.map((q) => {
              const progress =
                (Number(q.savedAmount || 0) /
                  Number(q.targetAmount || 1)) *
                100;

              return (
                <div
                  key={q.id}
                  className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="font-semibold text-black text-[15px]">
                        {q.title}
                      </p>

                      <p
                        className={`text-xs mt-1 capitalize ${
                          q.status === "in_progress"
                            ? "text-orange-600"
                            : q.status === "completed"
                            ? "text-green-500"
                            : q.status === "cancelled"
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {q.status.replace("_", " ")}
                      </p>

                    </div>

                    <button className="bg-white border border-gray-600 text-white text-xs px-2 py-1 rounded-full select-none active:scale-95"
                    onClick={() => {
                      setSelectedGoal(q);
                      setShowEditGoalModal(true);
                    }}>
                      ✏️
                    </button>
                    {/* edit */}

                    

                  </div>

                  {/* PROGRESS */}
                  <div className="mt-4">
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="bg-gray-600 text-white text-xs px-3 py-1 mt-2 rounded-full">
                      {Math.min(progress, 100).toFixed(0)}%
                    </div>
                  </div>

                  {/* AMOUNTS */}
                  <div className="flex items-end justify-between mt-4">

                    <div>
                      <p className="text-xs text-gray-400">
                        Saved
                      </p>

                      <p className="text-sm font-semibold text-green-600 mt-1">
                        Rp{" "}
                        {Number(q.savedAmount).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        Target
                      </p>

                      <p className="text-sm font-medium text-gray-700 mt-1">
                        Rp{" "}
                        {Number(q.targetAmount).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

            <p className="text-[10px] text-gray-400 mt-3">
              (fungsi ini TIDAK otomatis terhubung ke wallet — sehingga proses dilakukan secara manual sendiri untuk menyimpan perubahan saldo melalui proses transaksi)
            </p>
          </div>
        </section>



        {/* QUICK ACTIONS */}
        <section className="border rounded-2xl p-4">
          <div className="flex justify-between mb-3">
            <h2 className="font-bold me-16">Quick Actions</h2>

            <button className="bg-white border border-gray-600 text-white text-xs px-2 py-1 rounded-full select-none active:scale-95"
            onClick={() => {
              setShowDeleteQAModal(true);
            }}>
              🗑️
            </button>
            {/* sampah or trash */}
            

            <button
              onClick={() => setShowQuickActionModal(true)}
              className="text-xs bg-black text-white px-3 py-1 rounded-full active:scale-95"
            >
              + New
            </button>
          </div>

          {quickActions.length === 0 && (
            <p className="text-sm text-gray-400">No Quick Actions yet</p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((q) => (
              <button
                key={q.id}
                className="border rounded-xl p-3 text-left active:scale-95"
                onClick={() => {
                  setSelectedQuickAction(q);
                  setShowTrxModal(true);
                }}
              >
                <p className="font-semibold text-sm">{q.title}</p>
                <p className={`text-sm ${
                      q.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                  }`}>
                  {q.type === "income" ? "+" : "-"} Rp{" "}
                  {Number(q.amount).toLocaleString("id-ID")}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* TRANSACTIONS */}
        <section className="border rounded-2xl p-4 flex flex-col gap-3">

          <div className="flex justify-between items-center">
            <h2 className="font-bold me-5">Recent Transactions</h2>

            <button className="bg-white border border-gray-600 text-white text-xs px-2 py-1 rounded-full select-none active:scale-95"
            onClick={() => {
              setShowDeleteTrxModal(true);
            }}>
              🗑️
            </button>
            {/* sampah or trash */}


            <button
              onClick={() => {
                setSelectedQuickAction(null);
                setShowTrxModal(true);
              }}
              className="text-xs bg-black text-white px-3 py-1 rounded-full active:scale-95"
            >
              + Add
            </button>
          </div>


          {transactions.length === 0 ? (
            <p className="text-sm text-gray-400">No transactions yet</p>
          ): 
          <>
            <p className="text-[10px] text-gray-400">
            Showing {displayedTransactions.length} of {filteredTransactions.length} transactions
            </p>

            <div className="flex gap-2 items-center">

              <select
                value={trxMonthFilter}
                onChange={(e) => setTrxMonthFilter(e.target.value)}
                className="border rounded-lg px-2 py-1 text-xs bg-white"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {m === "all" ? "All Months ▾" : m}
                  </option>
                ))}
              </select>

              <select
                value={trxTypeFilter}
                onChange={(e) => setTrxTypeFilter(e.target.value)}
                className="border rounded-lg px-2 py-1 text-xs bg-white"
              >
                <option value="all">All Types ▾</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <select
                value={trxLimit}
                onChange={(e) => setTrxLimit(Number(e.target.value))}
                className="border rounded-lg px-2 py-1 text-xs bg-white"
              >
                <option value={10}>10 ▾</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>


            </div>




           </>
          }

          <div className="flex flex-col gap-3 rounded-2xl">

            
            
            {displayedTransactions.map((trx) => {
              const walletName =
                wallets.find((w) => w.id === trx.walletId)?.name ||
                "Unknown Wallet";

              return (
                <div
                  key={trx.id}
                  className="relative flex border border-black justify-between items-star p-3 rounded-2xl"
                >

                  <button
                    className="absolute border border-gray-800 bottom-2 right-1 text-xs bg-gray-100 p-1 mx-2 rounded hover:bg-gray-200"
                    onClick={async () => {
                      await copyToClipboard(formatTransaction(trx, walletName));
                      setCopiedId(trx.id);

                      setTimeout(() => {
                        setCopiedId(null);
                      }, 1500);
                    }}
                  >
                    {copiedId === trx.id ? "✔️" : "📋"}
                  </button>
                  {/* paste to clipboard */}

                  


                  <div>
                    <p className="font-semibold text-sm">
                      {trx.title}
                    </p>

                    

                    

                    

                     <p className="text-xs text-gray-500">
                      {new Date(trx.date?.toDate ? trx.date.toDate() : trx.date)
                        .toLocaleString("id-ID", {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                        .replace(".", ":")}
                    </p>

                    <p className="text-xs text-gray-500">
                      {walletName}
                    </p>

                  </div>

                  

                  <p
                    className={`font-bold text-sm ${
                      trx.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {trx.type === "income" ? "+" : "-"} Rp{" "}
                    {Number(trx.amount).toLocaleString("id-ID")}
                  </p>

                  
                </div>
              );
            })}
          </div>
        </section>

        {/* MONTHLY OVERVIEW */}
        <section className="border rounded-2xl p-4">

          <h2 className="font-bold">
            Monthly Overview
          </h2>

          <p className="text-gray-500 text-sm">
            {monthId}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">

            <div>
              <p className="text-gray-500">Total Balance</p>
              <p className="font-bold">
                Rp {totalBalance.toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Total Income</p>
              <p className="font-bold text-green-500">
                + Rp {totalIncome.toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Total Expense</p>
              <p className="font-bold text-red-500">
                - Rp {totalExpense.toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Fee %</p>

              <input
                type="number"
                value={feePercent}
                onChange={(e) => setFeePercent(Number(e.target.value))}
                className="font-bold border p-2 rounded w-20"
              />
            </div>

            <div className="col-span-2">
              <p className="text-gray-500">Fee Expense</p>
              <p className="font-bold text-purple-500">
                Rp {feeExpense.toLocaleString("id-ID")}
              </p>
            </div>

            <button
            onClick={() => setShowMonthSyncModal(true)}
            className="w-full mt-3 bg-black text-white py-2 rounded-xl active:scale-95"
          >
            ⟳ Sync Data
          </button>

          </div>

        </section>

        {/* PREV MONTH DATA */}
        {/* MONTHLY HISTORY (FROM FIRESTORE) */}
        <section className="border rounded-2xl p-4">

          <div className="flex justify-between items-center">
            <h2 className="font-bold">
              Monthly History
            </h2>

            <button className="bg-white border border-gray-600 text-white text-xs px-2 py-1 rounded-full select-none active:scale-95"
            onClick={() => {
              setShowDeleteDataModal(true);
            }}>
              🗑️
            </button>
            {/* sampah or trash */}
          </div>


          <p className="text-gray-500 text-sm">
            Stored snapshot per month (Firestore datas)
          </p>

          <div className="mt-3 flex flex-col gap-3">

            {sortedMonthlyData.length === 0 && (
              <p className="text-sm text-gray-400">
                No monthly snapshots yet
              </p>
            )}

            {sortedMonthlyData.map((m) => (
              <div
                key={m.id}
                className="relative border rounded-xl p-3 bg-white"
              >

                

                <button
                    className="absolute border border-gray-800 bottom-3 right-2 text-xs bg-gray-100 p-1 mx-2 rounded hover:bg-gray-200"
                    onClick={async () => {
                      await copyToClipboard(formatMonthlyData(m));
                      setCopiedId(m.id);

                      setTimeout(() => {
                        setCopiedId(null);
                      }, 1500);
                    }}
                  >
                    {copiedId === m.id ? "✔️" : "📋"}
                </button>
                {/* paste to clipboard */}

                {/* MONTH */}
                <p className="font-bold text-sm">
                  {m.month}
                </p>

                {/* INCOME / EXPENSE */}
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-green-500">
                    + Rp {Number(m.totalIncome || 0).toLocaleString("id-ID")}
                  </span>

                  <span className="text-red-500">
                    - Rp {Number(m.totalExpense || 0).toLocaleString("id-ID")}
                  </span>
                </div>

                {/* BALANCE */}
                <p className="text-xs mt-1 text-blue-500 font-semibold">
                  Balance: Rp {Number(m.totalBalance || 0).toLocaleString("id-ID")}
                </p>

                {/* FEE */}
                <p className="text-xs mt-1 text-purple-500">
                  Fee: Rp {Number(m.feeExpense || 0).toLocaleString("id-ID")} ({m.feePercent}%)
                </p>

                {/* UPDATED */}
                <p className="text-[10px] text-gray-400 mt-1">
                  Updated: {m.updatedAt?.toDate?.().toLocaleString?.("id-ID")}
                </p>

              </div>
            ))}

          </div>

        </section>




      </div>

      {/* MODALS */}
      <AddWalletModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />

      <QuickActionModal
        open={showQuickActionModal}
        onClose={() => setShowQuickActionModal(false)}
      />

      <GoalModal
        open={showGoalModal}
        onClose={() => setShowGoalModal(false)}
      />

      <EditGoalModal
        open={showEditGoalModal}
        onClose={() => {
          setShowEditGoalModal(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />

      <DeleteQAModal
        open={showDeleteQAModal}
        onClose={() => setShowDeleteQAModal(false)}
        quickActions={quickActions}
      />

      <DeleteTrxModal
        open={showDeleteTrxModal}
        onClose={() => setShowDeleteTrxModal(false)}
        transactions={transactions}
      />

      <DeleteWalletModal
        open={showDeleteWalletModal}
        onClose={() => setShowDeleteWalletModal(false)}
        wallets={wallets}
      />

      <DeleteDataModal
        open={showDeleteDataModal}
        onClose={() => setShowDeleteDataModal(false)}
        monthlyData={monthlyData}
      />




      <ExchangeBalanceModal
        open={showExchangeBalanceModal}
        onClose={() => setShowExchangeBalanceModal(false)}
        wallets={wallets}
      />

      <TransactionModal
        open={showTrxModal}
        onClose={() => {
          setShowTrxModal(false);
          setSelectedQuickAction(null);
        }}
        wallets={wallets}
        quickAction={selectedQuickAction}
      />

      <MonthSyncModal
        open={showMonthSyncModal}
        onClose={() => setShowMonthSyncModal(false)}
        data={monthDataForSync}
        uid={uid}
      />

    </div>
  );
}