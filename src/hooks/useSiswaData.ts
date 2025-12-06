"use client";

import { getJurusanById } from "@/api/admin/jurusan";
import { getKelasById } from "@/api/admin/kelas";
import { getSiswa, historyPengajuan } from "@/api/admin/siswa";
import { DataPengajuan, Siswa, SiswaData } from "@/types/api";
import { useEffect, useState } from "react";

export function useSiswaDataStorage() {
  const [data, setData] = useState<SiswaData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGuruData = async () => {
      try {
        // Coba ambil dari localStorage dulu (dari login response)
        const storedGuruData = localStorage.getItem("siswaData");

        if (storedGuruData) {
          const parsedData = JSON.parse(storedGuruData);
          setData(parsedData);
          setLoading(false);
          return;
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuruData();
  }, []);

  return { data, loading };
}
export function setSiswaDataStorage(data: SiswaData) {
  localStorage.setItem("siswaData", JSON.stringify(data));
}

export function useSiswaDataLogin() {
  const [siswa, setSiswa] = useState<Siswa | null>(null);
  const [loadingSiswa, setLoadingSiswa] = useState(true);
  const { data, loading } = useSiswaDataStorage();

  useEffect(() => {
    async function getSiswaData() {
      if (loading) return;
      try {
        const response = await getSiswa(
          data?.nama_lengkap,
          undefined,
          data?.kelas_id
        );
        setSiswa(response.data.data[0]);
        setLoadingSiswa(false);
      } catch (error) {
        console.log(error);
        setLoadingSiswa(false);
      } finally {
        setLoadingSiswa(false);
      }
    }
    getSiswaData();
  }, [data, loading]);

  return {
    siswa,
    loadingSiswa,
  };
}

export function useKelasDataSiswaLogin() {
  const [kelas, setKelas] = useState<{
    id: number;
    nama: string;
    jurusan_id: number;
  } | null>(null);
  const [loadingKelas, setLoadingKelas] = useState(true);
  const { data, loading } = useSiswaDataStorage();

  useEffect(() => {
    if (loading) {
      return;
    }
    async function getKelasData() {
      try {
        const response = await getKelasById(Number(data?.kelas_id));
        setKelas({
          id: response.data.id,
          nama: response.data.nama,
          jurusan_id: response.data.jurusan_id,
        });
        setLoadingKelas(false);
      } catch (error) {
        setLoadingKelas(false);
        console.log(error);
      } finally {
        setLoadingKelas(false);
      }
    }
    getKelasData();
  }, [data, loading]);

  return { kelas, loadingKelas };
}

export function useJurusanSiswaLogin() {
  const [jurusan, setJurusan] = useState<{ id: number; nama: string } | null>(
    null
  );
  const [loadingJurusan, setLoadingJurusan] = useState(true);
  const { kelas, loadingKelas } = useKelasDataSiswaLogin();

  useEffect(() => {
    async function getJurusanData() {
      if (!kelas) return;
      try {
        const response = await getJurusanById(kelas.jurusan_id);
        setJurusan({
          id: response.data.id,
          nama: response.data.nama,
        });
        setLoadingJurusan(false);
      } catch (error) {
        setLoadingJurusan(false);
        console.log(error);
      } finally {
        setLoadingJurusan(false);
      }
    }
    getJurusanData();
  }, [kelas, loadingKelas]);

  return {
    jurusan,
    loadingJurusan,
  };
}

export function useCheckPermohonan() {
  const [dataCheckPermohonan, setDataCheckPermohonan] = useState();
}

export function useSiswaPengajuanData() {
  const [dataPengajuan, setDataPengajuan] = useState<DataPengajuan[] | null>();

  useEffect(() => {
    async function fetch() {
      try {
        const response = await historyPengajuan();
        setDataPengajuan(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

  return {
    dataPengajuan,
  };
}
