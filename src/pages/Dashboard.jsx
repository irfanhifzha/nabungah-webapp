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

export default function Dashboard() {
  const [uid, setUid] = useState(null);

  const [username, setUsername] = useState(null);

  const [wallets, setWallets] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  // MODALS
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [showTrxModal, setShowTrxModal] = useState(false);
  const [showExchangeBalanceModal, setShowExchangeBalanceModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [showDeleteQAModal, setShowDeleteQAModal] = useState(false);
  const [showDeleteTrxModal, setShowDeleteTrxModal] = useState(false);

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedQuickAction, setSelectedQuickAction] = useState(null);

  // AUTH
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUid(user ? user.uid : null);
    });

    return () => unsub();
  }, []);

  // FIRESTORE LISTENERS
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
      limit(20)
    );

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

    return () => {
      unsubUser();
      unsubWallets();
      unsubQA();
      unsubTrx();
      unsubGoal();
    };
  }, [uid]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // =========================
  // 🔥 DATE HELPERS
  // =========================
  const now = new Date();
  const monthId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // =========================
  // 🔥 COMPUTED TOTAL BALANCE
  // =========================
  const totalBalance = useMemo(() => {
    return wallets.reduce((acc, w) => acc + Number(w.balance || 0), 0);
  }, [wallets]);

  // =========================
  // 🔥 MONTH FILTER
  // =========================
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.date?.toDate) return false;
      const d = t.date.toDate();
      const id = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return id === monthId;
    });
  }, [transactions, monthId]);

  const totalIncome = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  }, [monthlyTransactions]);

  const totalExpense = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  }, [monthlyTransactions]);

  // default fee percent (can later come from Firestore settings)
  const [feePercent, setFeePercent] = useState(2.5);

  const feeExpense = useMemo(() => {
    return Math.round((totalIncome * feePercent) / 100);
  }, [totalIncome, feePercent]);


  // NEW FOR DATA MONTHLY

  const [showMonthSyncModal, setShowMonthSyncModal] = useState(false);

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
            <h2 className="font-bold">Wallets</h2>
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
            <p className="text-[10px] text-gray-400">
            Showing 20 latest transactions
            </p>
          }

          <div className="flex flex-col gap-3">
            {transactions.map((trx) => {
              const walletName =
                wallets.find((w) => w.id === trx.walletId)?.name ||
                "Unknown Wallet";

              return (
                <div
                  key={trx.id}
                  className="flex justify-between items-start"
                >
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