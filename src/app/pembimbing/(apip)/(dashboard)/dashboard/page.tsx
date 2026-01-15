"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Interfaces based on user request
interface IndustriData {
  industri_id: number;
  industri_nama: string;
  jumlah_siswa: number;
}

interface SiswaData {
  application_id: number;
  industri_id: number;
  industri_nama: string;
  siswa_id: number;
  siswa_nama: string;
  siswa_username: string;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}

export default function Dashboard() {
  // Mock Data
  const daftarIndustri: IndustriData[] = [
    {
      industri_id: 1,
      industri_nama: "PT. Teknologi Maju",
      jumlah_siswa: 5,
    },
    {
      industri_id: 2,
      industri_nama: "CV. Solusi Digital",
      jumlah_siswa: 3,
    },
    {
      industri_id: 3,
      industri_nama: "Telkom Indonesia",
      jumlah_siswa: 8,
    },
  ];

  const daftarSiswa: SiswaData[] = [
    {
      application_id: 101,
      industri_id: 1,
      industri_nama: "PT. Teknologi Maju",
      siswa_id: 1001,
      siswa_nama: "Ahmad Sahroni",
      siswa_username: "ahmads",
      status: "Pending",
      tanggal_mulai: "2026-01-15",
      tanggal_selesai: "2026-04-15",
    },
    {
      application_id: 102,
      industri_id: 2,
      industri_nama: "CV. Solusi Digital",
      siswa_id: 1002,
      siswa_nama: "Bintang Firman",
      siswa_username: "bintangf",
      status: "Approved",
      tanggal_mulai: "2026-02-01",
      tanggal_selesai: "2026-05-01",
    },
    {
      application_id: 103,
      industri_id: 1,
      industri_nama: "PT. Teknologi Maju",
      siswa_id: 1003,
      siswa_nama: "Citra Dewi",
      siswa_username: "citrad",
      status: "Pending",
      tanggal_mulai: "2026-01-20",
      tanggal_selesai: "2026-04-20",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredIndustri = daftarIndustri.filter((item) =>
    item.industri_nama.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSiswa = daftarSiswa.filter(
    (item) =>
      item.siswa_nama.toLowerCase().includes(search.toLowerCase()) ||
      item.industri_nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased">
      <div className="flex">
        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8">
          {/* Cards */}
          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Siswa Aktif PKL</p>
                <h2 className="text-4xl font-extrabold text-black mt-2">156</h2>
                <p className="text-sm text-green-500 mt-3">
                  ↑ +12% dari bulan lalu
                </p>
              </div>
              <div className="w-16 h-16 bg-[#dcefff] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#1b63d6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 21h8a2 2 0 002-2v-2a4 4 0 00-4-4H10a4 4 0 00-4 4v2a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Industri Partner</p>
                <h2 className="text-4xl font-extrabold text-black mt-2">26</h2>
                <p className="text-sm text-blue-600 mt-3">Aktif bekerjasama</p>
              </div>
              <div className="w-16 h-16 bg-[#f3e6e6] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#8b3032]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7zM7 7h10v4H7z" />
                </svg>
              </div>
            </div>
          </section>

          <Tabs defaultValue="industri" className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <TabsList className="bg-gray-100 p-1 rounded-xl">
                <TabsTrigger
                  value="industri"
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#6e1f21] data-[state=active]:shadow-sm"
                >
                  Daftar Industri
                </TabsTrigger>
                <TabsTrigger
                  value="siswa"
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#6e1f21] data-[state=active]:shadow-sm"
                >
                  Daftar Siswa
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white border-gray-200 focus:ring-[#6e1f21] focus:border-[#6e1f21]"
                />
              </div>
            </div>

            <TabsContent value="industri" className="mt-0">
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Nama Industri</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Jumlah Siswa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIndustri.length > 0 ? (
                      filteredIndustri.map((item) => (
                        <TableRow key={item.industri_id} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium text-gray-900">
                            {item.industri_nama}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.jumlah_siswa} Siswa
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center text-gray-500">
                          Tidak ada data industri ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="siswa" className="mt-0">
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Nama Siswa</TableHead>
                      <TableHead className="font-semibold text-gray-700">Username</TableHead>
                      <TableHead className="font-semibold text-gray-700">Industri</TableHead>
                      <TableHead className="font-semibold text-gray-700">Periode</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSiswa.length > 0 ? (
                      filteredSiswa.map((item) => (
                        <TableRow key={item.application_id} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium text-gray-900">
                            {item.siswa_nama}
                          </TableCell>
                          <TableCell className="text-gray-500">@{item.siswa_username}</TableCell>
                          <TableCell>{item.industri_nama}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {item.tanggal_mulai} - {item.tanggal_selesai}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.status === "Approved"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : item.status === "Pending"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                          Tidak ada data siswa ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
