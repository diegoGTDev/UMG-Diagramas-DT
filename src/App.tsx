import './index.css'

function App() {


  return (
    <>
      <div className="bg-[#1F4B76] p-2 w-full flex flex-row">
        <img
          src={`${import.meta.env.BASE_URL}mariano_logo.png`}
          alt="Logo de la mariano galvez"
          className="size-20"
        />
        <form action="" className="w-full flex flex-row justify-center items-center mt-5">
          <div className="relative z-0 w-2xl mb-5 group">
            <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-red-500 peer" placeholder="" required />
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Expresión Regular</label>
          </div>
        </form>
      </div>
      <h1 className="text-2xl font-bold text-black">Hello world</h1>
    </>
  )
}

export default App
