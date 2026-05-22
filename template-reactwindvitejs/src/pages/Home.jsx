
export default function Home() {

  return (
    <>
      <div className='m-0 p-0 flex justify-center items-center flex flex-col gap-4 bg-emerald-500 h-screen'>
        <div className='text-white text-sm'>Halo</div>

        <button className='bg-orange-500 rounded-md p-2 cursor-pointer' onClick={() => window.location.href = "/about"}>to about</button>

      </div>


    </>
  )
}
