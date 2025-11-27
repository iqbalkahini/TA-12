export default function CetakSuratPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Cetak Surat</h1>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-8">
                <p className="text-muted-foreground">
                    Form cetak surat akan ditampilkan di sini
                </p>
            </div>
        </div>
    )
}
