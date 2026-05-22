
export default function About() {
  return (
    <>
      <div className='m-0 p-0 flex justify-center items-center bg-red-500 h-screen gap-3'>
        <div className='text-white text-sm'>Halo this is about page</div>

        <button className='bg-orange-500 rounded-md p-2 cursor-pointer' onClick={() => window.location.href = "/"}>to homepage</button>

        <button className='bg-orange-500 rounded-md p-2 cursor-pointer' onClick={() => window.location.href = "/notfounasdf"}>to 404 page</button>

      </div>


    </>
  )
}
