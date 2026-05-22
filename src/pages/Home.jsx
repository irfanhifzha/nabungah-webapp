
export default function Home() {

  return (
    <>
      <div className='m-0 p-0 flex justify-center items-center flex flex-col gap-4 h-screen'>
        <div className="p-10 rounded-[20px] border border-[var(--border)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-all duration-200 ease-in-out">
          <div className='text-black text-small'>Halo</div>

          <a href='/about' className="flex justify-center items-center gap-3 w-[240px] h-fit py-[14px] px-4 bg-white rounded-[14px] border border-[var(--border)] shadow-[0_4px_10px_rgba(0,0,0,0.05)] cursor-pointer transition-all duration-200 ease-in-out mt-5">go to about</a>
        </div>

      </div>


    </>
  )
}
