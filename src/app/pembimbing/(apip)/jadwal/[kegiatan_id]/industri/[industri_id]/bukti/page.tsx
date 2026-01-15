"use client"

import { createRealisasiKegiatanPkl } from "@/api/pembimbing";
import { uploadImages } from "@/api/upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PostRealisasiKegiatanPkl } from "@/types/api";
import { useParams, useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import imageCompression from 'browser-image-compression';
import { cn } from "@/lib/utils";

export default function UploadDokumenBukti() {
  const { kegiatan_id, industri_id } = useParams()
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<{
    id: string,
    url: string,
    progress: number
  }[]>([])
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
  const [doneCompress, setDoneCompress] = useState<boolean>(false)
  const router = useRouter()

  const handleCompressImage = async (image: File) => {
    try {
      setDoneCompress(true)
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        onProgress: (progress: number) => {
          setPreviews((prev) =>
            prev.map((p) => (p.id === image.name ? { ...p, progress } : p))
          );
        }
      }
      const res = await imageCompression(image, options)
      return res
    } catch (error) {
      throw error
    } finally {
      setDoneCompress(false)
    }
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const chosenFiles = Array.from(e.target.files);

      const newPreviews = chosenFiles.map((file) => ({
        id: file.name,
        url: URL.createObjectURL(file),
        progress: 0,
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);

      for (let i = 0; i < chosenFiles.length; i++) {
        const element = chosenFiles[i];
        const compressedImage = await handleCompressImage(element)
        setImages((prev) => [...prev, compressedImage]);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (images.length === 0) {
        toast.warning("Harap pilih file terlebih dahulu");
        return;
      }

      const formData = new FormData()
      images.forEach((image) => {
        formData.append('files', image)
      })
      const resulUploadImages = await uploadImages(formData)

      console.log("Upload Result:", resulUploadImages)

      if (!resulUploadImages.success) {
        throw new Error(resulUploadImages.message || "Gagal upload gambar")
      }

      // Ambil URL dari hasil upload (Assuming result structure based on previous usage)
      const uploadedUrls = resulUploadImages.results.map((item: { url: string }) => item.url);

      const payload: PostRealisasiKegiatanPkl = {
        ...data,
        bukti_foto_urls: [...data.bukti_foto_urls, ...uploadedUrls]
      };

      console.log("Payload:", payload)

      const res = await createRealisasiKegiatanPkl(payload)

      console.log("Create Realisasi Result:", res) // Log response before check

      toast.success("Berhasil Unggah Dokumen Bukti")
      router.push(`/pembimbing/bukti-kegiatan`)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal Unggah Dokumen Bukti")
      console.error("Full Error:", error)
      if (error?.response) {
        console.error("Server Response:", error.response.data)
        console.error("Status Code:", error.response.status)
      }
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
            <h2 className="text-lg font-semibold">Unggah Dokumen Bukti</h2>

            <div>
              <label className="text-sm font-medium">
                Upload File <span className="text-red-500">*</span>
              </label>

              <div className="mt-2 border-2 border-dashed rounded-xl py-10 flex flex-col items-center text-gray-500 px-4">
                <div className="w-10 h-10 bg-gray-300 rounded mb-2 text-2xl flex items-center justify-center">📄</div>
                <p className="mb-4 text-center">Drag & drop file atau klik untuk browse</p>
                <Input
                  multiple
                  type="file"
                  onChange={handleImageChange}
                  accept="image/png, image/jpg"
                  className="max-w-xs cursor-pointer border-gray-300 focus:ring-[#6B0F0F] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                <div className={cn("flex gap-4 flex-wrap justify-center max-h-50 mt-5 overflow-y-auto w-full")}>
                  {
                    previews.map((preview, index) => {
                      if (preview.progress === 100) {
                        return (
                          <div key={index} className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                            <img
                              src={preview.url}
                              alt={`preview-${index}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                        )
                      } else {
                        return (
                          <div
                            key={index}
                            className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-3 p-4 shadow-sm"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse" />

                            {/* Circular Progress or Text */}
                            <div className="relative z-10 flex flex-col items-center gap-2 w-full">
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="h-full bg-[#6B0F0F] rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(107,15,15,0.3)]"
                                  style={{ width: `${preview.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-[#6B0F0F]">
                                {Math.round(preview.progress)}%
                              </span>
                            </div>

                            <p className="relative z-10 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                              Mengkompres...
                            </p>
                          </div>
                        )
                      }
                    })
                  }
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
            </div>

            <div className="flex justify-end">
              <button className="bg-[#6B0F0F] text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={doneCompress}>
                Unggah Dokumen
              </button>
            </div>
          </section>
        </div>
      </main >
    </div >
  );
}
