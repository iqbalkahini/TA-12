"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Building2, Users } from "lucide-react";
import { TasksRealisasiPkl } from "@/types/api";
import { getTasksRealisasiPkl } from "@/api/pembimbing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [data, setData] = useState<TasksRealisasiPkl | null>(null);
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await getTasksRealisasiPkl();
      setData(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter logic: Check if search matches industry name or any student name/class/username
  const filteredData = data?.data.filter((item) => {
    const searchLower = search.toLowerCase();
    const industryMatch = item.industri.nama.toLowerCase().includes(searchLower);
    const studentMatch = item.siswa.some(
      (s) =>
        s.nama.toLowerCase().includes(searchLower) ||
        s.kelas.toLowerCase().includes(searchLower) ||
        s.username.toLowerCase().includes(searchLower)
    );
    return industryMatch || studentMatch;
  });

  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased">
      <div className="flex">
        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8">
          {/* Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Total Tugas</p>
                <h2 className="text-4xl font-extrabold text-black mt-2">
                  {data?.summary.total_tasks ?? 0}
                </h2>
                <p className="text-sm text-yellow-600 mt-3">
                  {data?.summary.pending_tasks ?? 0} Pending
                </p>
              </div>
              <div className="w-16 h-16 bg-[#dcefff] rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-[#1b63d6]" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Total Industri</p>
                <h2 className="text-4xl font-extrabold text-black mt-2">
                  {data?.summary.total_industri ?? 0}
                </h2>
                <p className="text-sm text-blue-600 mt-3">Aktif</p>
              </div>
              <div className="w-16 h-16 bg-[#f3e6e6] rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[#8b3032]" />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Daftar Industri & Siswa</h2>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari industri atau siswa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white border-gray-200 focus:ring-[#6e1f21] focus:border-[#6e1f21]"
                />
              </div>
            </div>

            {filteredData?.map((item, index) => (
              <Card key={index} className="border border-gray-100 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg font-bold text-[#6e1f21]">
                          {item.industri.nama}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs bg-white text-gray-600 border-gray-200">
                          {item.industri.jenis_industri}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {item.industri.alamat}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                      {item.siswa_count} Siswa
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white hover:bg-white border-b border-gray-100">
                        <TableHead className="pl-6 w-[250px]">Nama Siswa</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>NISN</TableHead>
                        <TableHead className="text-right pr-6">Kelas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item.siswa.length > 0 ? (
                        item.siswa.map((siswa) => (
                          <TableRow key={siswa.id} className="hover:bg-gray-50/50 border-b border-gray-50 last:border-0">
                            <TableCell className="pl-6 font-medium text-gray-900">{siswa.nama}</TableCell>
                            <TableCell className="text-gray-500">@{siswa.username}</TableCell>
                            <TableCell className="text-gray-500">{siswa.nisn}</TableCell>
                            <TableCell className="text-right pr-6">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-normal">
                                {siswa.kelas}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-20 text-center text-gray-400 text-sm">
                            Tidak ada siswa terdaftar di industri ini.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}

            {filteredData?.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium">Tidak ada data ditemukan</p>
                <p className="text-sm">Coba kata kunci pencarian lain.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
