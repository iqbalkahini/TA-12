"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PostRealisasiKegiatanPkl } from "@/types/api";
import { useParams } from "next/navigation";
import { useState, ChangeEvent } from "react";

export default function UploadDokumenBukti() {
  const { kegiatan_id, industri_id } = useParams()
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [data, setData] = useState<PostRealisasiKegiatanPkl>({
    bukti_foto_urls: [],
    catatan: "",
    industri_id: Number(industri_id),
    kegiatan_id: Number(kegiatan_id),
    tanggal_realisasi: new Intl.DateTimeFormat('fr-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date()),
  })

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const chosenFiles = Array.from(e.target.files); // Ubah FileList menjadi Array

      // Tambahkan file baru ke state yang sudah ada
      setImages((prev) => [...prev, ...chosenFiles]);

      // Buat URL preview untuk setiap file baru
      const newPreviews = chosenFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex">
      {/* MAIN CONTENT */}
      <main className="flex-1">

        {/* CONTENT */}
        <div className="p-8 space-y-10">
          {/* UPLOAD SECTION */}
          <section className="border rounded-xl p-6 space-y-6 max-w-4xl">
            <h2 className="text-lg font-semibold">Upload Dokumen Bukti</h2>

            <div>
              <label className="text-sm font-medium">
                Upload File <span className="text-red-500">*</span>
              </label>

              <div className="mt-2 border-2 border-dashed rounded-xl py-10 flex flex-col items-center text-gray-500 px-4">
                <div className="w-10 h-10 bg-gray-300 rounded mb-2 text-2xl flex items-center justify-center">📄</div>
                <p className="mb-4 text-center">Drag & drop file atau klik untuk browse</p>
                <Input
                  type="file"
                  onChange={handleImageChange}
                  className="max-w-xs cursor-pointer border-gray-300 focus:ring-[#6B0F0F] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>
              <div className="space-y-2 mt-3">
                <Label>Deskripsi</Label>
                <Input type="text" placeholder="Masukkan deskripsi" multiple onChange={(e) => {
                  setData({
                    ...data,
                    catatan: e.target.value
                  })
                }} />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-[#6B0F0F] text-white px-6 py-2 rounded-lg">
                Upload Dokumen
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
