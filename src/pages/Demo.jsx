import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token"); // kalau kamu pakai guard
    navigate("/login");
  };

  const addwallet = navigate("/");


  return (
    <>
      <div className="min-h-screen bg-[#f5f7fb] flex justify-center items-center p-4">

        {/* PHONE CONTAINER */}
        <div className="w-[390px] min-h-[844px] bg-white border border-gray-200 rounded-[38px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col gap-5">

          {/* HEADER */}
          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-gray-500">
                📝 Balance Notes
              </p>
            </div>

            <button className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-lg font-semibold transition duration-200 hover:bg-gray-800 hover:-translate-y-2 cursor-pointer"
            onClick={handleLogout}>
              I
            </button>

          </div>

          {/* MAIN BALANCE */}
          <section className="bg-white border border-gray-200 text-black rounded-[28px] p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">

            <p className="text-sm text-black-300">
              Cash
            </p>

            <h1 className="text-4xl font-bold mt-1">
              Rp 10.000
            </h1>

            <div className="w-[20px] h-[2px] my-7 bg-lime-900 rounded"></div>

            
            <p className="text-sm text-black-300">
              Dana
            </p>

            <h1 className="text-4xl font-bold mt-1">
              Rp 10.000
            </h1>

            <button className="p-3  my-5 rounded-2xl bg-black text-white flex items-center justify-center text-lg font-semibold transition duration-200 hover:bg-gray-800 hover:-translate-y-2 cursor-pointer"
            onClick={addwallet}>
              + add wallets
            </button>

            

          </section>


          {/* GENERAL ACTION */}
          <section className="grid grid-cols-2 gap-4">

            {/* INCOME */}
            <button className="bg-white items-center flex flex-col h-fit border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition duration-200 hover:bg-gray-200 hover:-translate-y-2 cursor-pointer">

              <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
                📈
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Pemasukan
              </p>
            </button>

            {/* EXPENSE */}
            <button className="bg-white items-center flex flex-col h-fit border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition duration-200 hover:bg-gray-200 hover:-translate-y-2 cursor-pointer">

              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                📉
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Pengeluaran
              </p>
            </button>

          </section>


          {/* QUICK ACTIOn LIST */}
          <section className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] flex-1">

            <h2 className="font-bold mb-5">Quick Action</h2>

              <button className="bg-white items-center flex flex-col h-fit border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition duration-200 hover:bg-gray-200 hover:-translate-y-2 cursor-pointer">

              <p className="text-md font-bold text-gray-500">
                Gaji Bulanan
              </p>

              <p>
                {/* type field in quickaction */}
                <span>+</span>

                {/* amount */}
                <span className="ms-1">Rp. 700.000</span>
              </p>
            </button>

            <button className="bg-white items-center flex flex-col h-fit border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition duration-200 hover:bg-gray-200 hover:-translate-y-2 cursor-pointer">

              <p className="text-md font-bold text-gray-500">
                Isi Bensin
              </p>

              <p>
                {/* type field in quickaction */}
                <span>-</span>

                {/* amount */}
                <span className="ms-1">Rp. 20.000</span>
              </p>
            </button>

          </section>


          
          {/* TRANSACTION LIST */}
          <section className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] flex-1">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-lg font-bold text-black">
                Recent Transaction
              </h2>

              <button className="text-sm text-gray-500">
                Semua
              </button>

            </div>

            <div className="flex flex-col gap-4">

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    💵
                  </div>

                  <div>
                    <h3 className="font-semibold text-black text-sm">
                      Gaji Bulanan
                    </h3>

                    <p className="text-xs text-gray-500">
                      Hari Ini
                    </p>
                  </div>

                </div>

                <span className="text-green-600 font-bold text-sm">
                  +7jt
                </span>

              </div>

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                    🛒
                  </div>

                  <div>
                    <h3 className="font-semibold text-black text-sm">
                      Belanja
                    </h3>

                    <p className="text-xs text-gray-500">
                      Kemarin
                    </p>
                  </div>

                </div>

                <span className="text-red-500 font-bold text-sm">
                  -850k
                </span>

              </div>

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    🎨
                  </div>

                  <div>
                    <h3 className="font-semibold text-black text-sm">
                      Freelance
                    </h3>

                    <p className="text-xs text-gray-500">
                      2 Hari Lalu
                    </p>
                  </div>

                </div>

                <span className="text-green-600 font-bold text-sm">
                  +1.2jt
                </span>

              </div>

            </div>

          </section>

          {/* BOTTOM NAV */}
          <nav className="bg-white border border-gray-200 rounded-[24px] p-3 shadow-[0_4px_10px_rgba(0,0,0,0.05)] flex justify-around items-center">

            {/* dashboard - firestore quickaction subcol */}
            <button className="bg-white border border-blue-300  text-white w-14 h-14 rounded-2xl flex items-center justify-center text-xl">
              🏠
            </button>

            {/* data wallets and balance - firestore data subcol */}
            <button className="text-xl">
              📊
            </button>

            {/* all income-expenses sort by month - firestore transaction subcol */}
            <button className="text-xl">
              📅
            </button>

            {/* goals - firestore goals subcol */}
            <button className="text-xl">
              🎯
            </button>

            {/* user setting */}
            <button className="text-xl">
              👤
            </button>

          </nav>

        </div>

      </div>
    </>
  )
}

