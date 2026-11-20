

export default function Header(){
    return (
        <header className="flex gap-6 justify-around items-center text-xs md:text-base text-black/80 font-merienda">
                  <h1 className=" bg-white">
                    Write what you think. 
                  </h1>
                  <p className="hidden md:block bg-white">
                    Your thoughts, translated into selected language.
                  </p>
                  <span className="bg-white">
                    Learn how to say it. 
                  </span>
                </header>
    )
}