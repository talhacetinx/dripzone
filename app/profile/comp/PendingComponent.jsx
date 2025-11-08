"use client"

export default function PendingComponent(){
    return(
        <div className="w-full min-h-screen flex justify-center items-center text-white">
            <div className="flex flex-col">
                <img
                  src="/TpazLayer 2-topaz-enhance-min.png"
                  alt="Dripzone Logo"
                  className="h-12 w-auto object-contain filter drop-shadow-lg"
                />
                <h1 className="text-xl">Profiliniz Daha Onaylanmamıştır, onaylandığında sizlere e-posta yoluyla mesaj atılacaktır.</h1>
            </div>
        </div>
    )
}