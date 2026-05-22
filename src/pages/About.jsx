export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-[#f5f7fb] flex justify-center items-center p-4">

        {/* PHONE CONTAINER */}
        <div className="w-[390px] min-h-[844px] bg-white border border-gray-200 rounded-[38px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col gap-5">

          {/* HEADER */}
          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-gray-500">
                Selamat Datang 👋
              </p>

              <h1 className="text-2xl font-bold text-black mt-1">
                Nabung.
              </h1>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-lg font-semibold">
              A
            </div>

          </div>

          {/* MAIN BALANCE */}
          <section className="bg-black text-white rounded-[28px] p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">

            <p className="text-sm text-gray-300">
              Total Tabungan
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Rp 12.500.000
            </h1>

            <div className="flex justify-between items-center mt-6">

              <div>
                <p className="text-xs text-gray-400">
                  Target
                </p>

                <h2 className="text-lg font-semibold mt-1">
                  Rp 20jt
                </h2>
              </div>

              <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                <span className="text-green-400 text-sm font-medium">
                  +12%
                </span>
              </div>

            </div>

          </section>

          {/* QUICK STATS */}
          <section className="grid grid-cols-2 gap-4">

            {/* INCOME */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">

              <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
                💰
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Pemasukan
              </p>

              <h1 className="text-xl font-bold text-black mt-1">
                Rp 8.2jt
              </h1>

            </div>

            {/* EXPENSE */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">

              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                🧾
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Pengeluaran
              </p>

              <h1 className="text-xl font-bold text-black mt-1">
                Rp 3.4jt
              </h1>

            </div>

          </section>

          {/* SAVING PROGRESS */}
          <section className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">

            <div className="flex justify-between items-center">

              <h2 className="text-lg font-bold text-black">
                Progress Nabung
              </h2>

              <span className="text-sm text-gray-500">
                62%
              </span>

            </div>

            <div className="w-full h-3 bg-gray-100 rounded-full mt-5 overflow-hidden">
              <div className="w-[62%] h-full bg-black rounded-full"></div>
            </div>

          </section>

          {/* TRANSACTION LIST */}
          <section className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] flex-1">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-lg font-bold text-black">
                Transaksi
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

            <button className="bg-black text-white w-14 h-14 rounded-2xl flex items-center justify-center text-xl">
              🏠
            </button>

            <button className="text-xl">
              📊
            </button>

            <button className="text-xl">
              ➕
            </button>

            <button className="text-xl">
              🎯
            </button>

            <button className="text-xl">
              👤
            </button>

          </nav>

        </div>

      </div>
    </>
  )
}