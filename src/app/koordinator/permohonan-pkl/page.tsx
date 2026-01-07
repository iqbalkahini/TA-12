"use client";

import { useState } from "react";
import {
    Eye,
    Printer,
    RotateCcw,
    X,
    GraduationCap,
} from "lucide-react";

export default function FormPKL() {
    const [showPreview, setShowPreview] = useState(false);

    const [form, setForm] = useState({
        industri: "",
        nama: "",
        nis: "",
        kelas: "",
        jurusan: "",
        sekolah: "",
        alamat: "",
        kepsek: "",
        nip: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const isValid = () => {
        return Object.values(form).every((v) => v.trim() !== "");
    };

    const openPreview = () => {
        if (!isValid()) {
            alert("Harap lengkapi semua data");
            return;
        }
        setShowPreview(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10 font-inter">
            <div className="max-w-screen-xl mx-auto">
                <form className="bg-white border border-gray-300 rounded-xl p-10">
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Form Permohonan PKL</h2>
                        <button
                            type="button"
                            onClick={openPreview}
                            className="flex items-center gap-2 bg-red-800 text-white px-4 py-2 rounded-lg"
                        >
                            <Eye size={18} /> Preview Surat
                        </button>
                    </div>

                    {/* INDUSTRI */}
                    <div className="flex flex-col mb-5">
                        <label className="font-medium">
                            Industri <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="industri"
                            value={form.industri}
                            onChange={handleChange}
                            className="border border-gray-600 rounded-lg px-3 py-2"
                            placeholder="Pilih Industri"
                        />
                    </div>

                    {/* DATA SISWA */}
                    <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-4">
                        Data Siswa
                    </h3>

                    <div className="grid grid-cols-2 gap-5">
                        <Input label="Nama" id="nama" value={form.nama} onChange={handleChange} />
                        <Input label="NIS" id="nis" value={form.nis} onChange={handleChange} />

                        <Select
                            label="Kelas"
                            id="kelas"
                            value={form.kelas}
                            onChange={handleChange}
                            options={["XII"]}
                        />

                        <Select
                            label="Jurusan"
                            id="jurusan"
                            value={form.jurusan}
                            onChange={handleChange}
                            options={[
                                "Rekayasa Perangkat Lunak",
                                "Teknik Komputer dan Jaringan",
                            ]}
                        />
                    </div>

                    {/* DATA SEKOLAH */}
                    <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mt-8 mb-4">
                        Data Sekolah
                    </h3>

                    <Input
                        label="Nama Sekolah"
                        id="sekolah"
                        value={form.sekolah}
                        onChange={handleChange}
                    />

                    <div className="flex flex-col mb-5">
                        <label className="font-medium">
                            Alamat Sekolah <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="alamat"
                            rows={4}
                            value={form.alamat}
                            onChange={handleChange}
                            className="border border-gray-600 rounded-lg px-3 py-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <Input
                            label="Kepala Sekolah"
                            id="kepsek"
                            value={form.kepsek}
                            onChange={handleChange}
                        />
                        <Input
                            label="NIP"
                            id="nip"
                            value={form.nip}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ACTION */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            type="button"
                            onClick={() => {
                                openPreview();
                                setTimeout(() => window.print(), 300);
                            }}
                            className="flex items-center gap-2 bg-red-800 text-white px-4 py-2 rounded-lg"
                        >
                            <Printer size={18} /> Cetak Surat
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setForm({
                                    industri: "",
                                    nama: "",
                                    nis: "",
                                    kelas: "",
                                    jurusan: "",
                                    sekolah: "",
                                    alamat: "",
                                    kepsek: "",
                                    nip: "",
                                });
                                setShowPreview(false);
                            }}
                            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg"
                        >
                            <RotateCcw size={18} /> Reset
                        </button>
                    </div>
                </form>
            </div>

            {/* PREVIEW */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 print:bg-transparent">
                    <div className="bg-white w-[750px] p-12 rounded-xl relative print:shadow-none">
                        <button
                            onClick={() => window.print()}
                            className="absolute top-4 right-14"
                        >
                            <Printer />
                        </button>

                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute top-4 right-4"
                        >
                            <X />
                        </button>

                        {/* KOP */}
                        <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 border-2 border-black rounded-full flex items-center justify-center">
                                <GraduationCap />
                            </div>
                            <div className="text-center w-full">
                                <h3 className="font-bold">SMK NEGERI 2 SINGOSARI</h3>
                                <p className="text-xs">Jl. Persatuan No. 29 Tunjungtirto</p>
                                <p className="text-xs">Kab. Malang, Jawa Timur</p>
                            </div>
                        </div>

                        <hr className="my-4 border-black" />

                        <p className="text-right text-sm">Malang, 15 Oktober 2025</p>

                        <p className="text-center font-bold underline mt-6">
                            SURAT PERMOHONAN
                        </p>
                        <p className="text-center text-sm mb-6">
                            Nomor : 005/PKL/SMKN2/2025
                        </p>

                        <div className="text-sm leading-relaxed text-justify">
                            <p>
                                Kepada Yth.<br />
                                Pimpinan <strong>{form.industri}</strong><br />
                                Di Tempat
                            </p>

                            <p className="mt-3">Dengan hormat,</p>

                            <p>
                                Sehubungan dengan pelaksanaan program PKL, kami mengajukan
                                permohonan kepada pihak <strong>{form.industri}</strong>.
                            </p>

                            <table className="my-4">
                                <tbody>
                                    <tr><td>Nama</td><td>: {form.nama}</td></tr>
                                    <tr><td>NIS</td><td>: {form.nis}</td></tr>
                                    <tr><td>Kelas</td><td>: {form.kelas}</td></tr>
                                    <tr><td>Jurusan</td><td>: {form.jurusan}</td></tr>
                                </tbody>
                            </table>

                            <div className="mt-12 text-right">
                                Kepala Sekolah<br /><br /><br />
                                <strong>{form.kepsek}</strong><br />
                                NIP. {form.nip}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ==== COMPONENT KECIL ==== */
function Input({ label, id, value, onChange }: any) {
    return (
        <div className="flex flex-col mb-5">
            <label className="font-medium">
                {label} <span className="text-red-500">*</span>
            </label>
            <input
                id={id}
                value={value}
                onChange={onChange}
                className="border border-gray-600 rounded-lg px-3 py-2"
            />
        </div>
    );
}

function Select({ label, id, value, onChange, options }: any) {
    return (
        <div className="flex flex-col mb-5">
            <label className="font-medium">
                {label} <span className="text-red-500">*</span>
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="border border-gray-600 rounded-lg px-3 py-2"
            >
                <option value="">Pilih</option>
                {options.map((o: string) => (
                    <option key={o}>{o}</option>
                ))}
            </select>
        </div>
    );
}