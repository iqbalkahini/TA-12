
export default function PerizinanPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fb] text-[#333] font-sans">
            <header className="bg-white px-[30px] py-[15px] flex justify-between items-center border-b border-gray-300">
                <h1 className="text-xl font-bold">
                    <span className="text-[#d32f2f]">Magang</span>Hub
                </h1>
                <div className="flex gap-5 items-center">
                    <div className="relative">
                        🔔
                        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] px-1 rounded-full">3</span>
                    </div>
                    <div>⚙️</div>
                </div>
            </header>
        </div>
    )
}
