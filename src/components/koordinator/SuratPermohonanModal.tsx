"use client";

import { DaftarPermohonanPKL } from "@/types/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface SuratPermohonanProps {
    isOpen: boolean;
    onClose: () => void;
    application: any | null; // Allow passing PklPengajuanTerbaru 
    allApplications: any[];
    schoolData: any;
}

export function SuratPermohonanModal({ isOpen, onClose, application, allApplications, schoolData }: SuratPermohonanProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Surat_Permohonan_PKL_${application?.industri_nama || "Document"}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 20mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
            }
        `
    });

    if (!application || !schoolData) return null;

    // Filter students with same industry
    // Assuming we want to include all students appying to this industry, regardless of status?
    // Or only those with same status? The image implies specific students "yang akan kami ajukan" (Pending/Approved).
    // Let's include all for now.
    const sameIndustryApps = allApplications.filter(
        app => app.industri_nama === application.industri_nama
    );

    // Format Date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const year = currentDate.getFullYear();

    // Helper to format date range
    // If dates are null, use placeholders from application or fallback
    const startTanggal = application?.tanggal_mulai || application?.application?.tanggal_mulai;
    const endTanggal = application?.tanggal_selesai || application?.application?.tanggal_selesai;

    const startDate = startTanggal ? new Date(startTanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "................";
    const endDateString = endTanggal ? new Date(endTanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : `................ ${year + 1}`;

    // Construct address
    const address = `${schoolData.jalan}, ${schoolData.kelurahan}, ${schoolData.kecamatan}, ${schoolData.kabupaten_kota}, ${schoolData.provinsi}, ${schoolData.kode_pos}`;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[100vw] lg:h-[100vh] h-screen max-h-screen rounded-none overflow-y-auto bg-muted/80 bg-grey">
                <div className="container mx-auto max-w-4xl py-8">
                    <div className="flex justify-end mb-4 print:hidden">
                        <Button onClick={() => handlePrint()}><Printer className="mr-2 h-4 w-4" /> Cetak Surat</Button>
                    </div>

                    <div
                        ref={componentRef}
                        className="bg-white p-10 w-[210mm] min-h-auto mx-auto text-black font-serif text-sm leading-relaxed shadow-lg"
                        style={{ minHeight: '297mm', margin: '0 auto' }} // A4 dimensions
                    >
                        {/* Header */}
                        <div className="flex items-center border-b-4 border-black pb-2 mb-1 border-double">
                            <div className="w-[60px] h-[60px] flex-shrink-0 mr-4 flex items-center justify-center">
                                <img src={'https://upload.wikimedia.org/wikipedia/commons/7/74/Coat_of_arms_of_East_Java.svg'} alt="Logo" className="w-full h-auto object-contain" />
                            </div>
                            <div className="text-center flex-grow">
                                <h2 className="text-[14pt] font-bold uppercase">PEMERINTAH PROVINSI JAWA TIMUR</h2>
                                <h2 className="text-[14pt] font-bold uppercase">DINAS PENDIDIKAN</h2>
                                <h1 className="text-[16pt] font-bold uppercase">{schoolData.nama_sekolah}</h1>
                                <p className="text-[10pt]">{address}</p>
                                <p className="text-[10pt]">Telepon {schoolData.nomor_telepon}</p>
                            </div>
                        </div>
                        {/* Double line border is handled by border-b-4 and style if needed, or simple border-b-4 is enough for preview */}
                        <div className="border-b border-black mb-4"></div>

                        {/* Date */}
                        <div className="text-right mb-4">
                            <p>{schoolData.kecamatan || "Singosari"}, {formattedDate}</p>
                        </div>

                        {/* Meta Data */}
                        <div className="mb-6">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="w-[100px]">Nomor</td>
                                        <td className="w-[10px]">:</td>
                                        <td>400.3/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /101.6.9.19/{year}</td>
                                    </tr>
                                    <tr>
                                        <td>Lampiran</td>
                                        <td>:</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>Perihal</td>
                                        <td>:</td>
                                        <td className="font-bold underline">Permohonan PKL</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Recipient */}
                        <div className="mb-6">
                            <p>Kepada Yth,</p>
                            <p>Pimpinan {application.industri_nama}</p>
                            <p>Di Tempat</p>
                        </div>

                        {/* Body */}
                        <div className="mb-4 text-justify indent-8">
                            <p>
                                Dengan ini kami sampaikan bahwa kegiatan Praktik Kerja Lapangan (PKL) siswa-siswi {schoolData.nama_sekolah} akan dilaksanakan sekitar tanggal {startDate} s.d {endDateString}.
                                Sehubungan dengan hal tersebut, kami mohon agar siswa-siswi kami dapat diterima di Instansi/Industri yang Bapak/Ibu pimpin.
                                Adapun siswa-siswi yang akan kami ajukan untuk melaksanakan Praktik Kerja Lapangan (PKL) di Instansi/Industri yang Bapak/Ibu pimpin adalah sebanyak {sameIndustryApps.length} orang, sebagai berikut:
                            </p>
                        </div>

                        {/* Students Table */}
                        <div className="mb-6">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr>
                                        <th className="border border-black px-2 py-1 bg-gray-100 w-[50px]">NO</th>
                                        <th className="border border-black px-2 py-1">NAMA</th>
                                        <th className="border border-black px-2 py-1 w-[100px]">KELAS</th>
                                        <th className="border border-black px-2 py-1 w-[150px]">Konsentrasi Keahlian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sameIndustryApps.map((app: any, index: number) => (
                                        <tr key={app?.application?.id || app?.application_id || index}>
                                            <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                                            <td className="border border-black px-2 py-1 uppercase">{app.siswa_username || app.siswa?.nama}</td>
                                            <td className="border border-black px-2 py-1 uppercase">{app.kelas_nama || app.kelas?.nama || '-'}</td>
                                            <td className="border border-black px-2 py-1 uppercase">{app.jurusan_nama || app.jurusan?.nama || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Closing */}
                        <div className="mb-8 text-justify indent-8">
                            <p>
                                Demikian surat permohonan ini kami ajukan. Atas perhatian dan kerjasama yang baik, kami sampaikan terima kasih.
                            </p>
                        </div>

                        {/* Signature */}
                        <div className="flex justify-end">
                            <div className="text-center w-[300px]">
                                <p className="mb-20">Kepala {schoolData.nama_sekolah},</p>
                                <p className="font-bold underline uppercase">{schoolData.kepala_sekolah}</p>
                                <p className="">NIP. {schoolData.nip_kepala_sekolah || "19700210 199802 2 009"}</p>
                                <p className="font-bold">{schoolData.pembina_utama_muda || "Pembina Utama Muda (IV/c)"}</p> {/* Hardcoded rank from image if not in data, or just leave it */}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
