"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Printer,
  Plus,
  Trash2,
  FileText,
  Building2,
  User,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { ApiResponseSekolah, Guru } from "@/types/api";
import { getSekolah } from "@/api/public";
import { getGuru } from "@/api/admin/guru";
import { kegiatanPklById } from "@/api/pembimbing";
import { useParams } from "next/navigation";
import { jadwalPkl } from "@/types/api";
import { downloadPDF, postData } from "@/api/files";

const schoolInfoSchema = z.object({
  nama_sekolah: z.string().min(1, "Nama sekolah harus diisi"),
  alamat_jalan: z.string().min(1, "Alamat harus diisi"),
  kelurahan: z.string().min(1, "Kelurahan harus diisi"),
  kecamatan: z.string().min(1, "Kecamatan harus diisi"),
  kab_kota: z.string().min(1, "Kab/Kota harus diisi"),
  provinsi: z.string().min(1, "Provinsi harus diisi"),
  kode_pos: z.string().min(1, "Kode Pos harus diisi"),
  telepon: z.string().min(1, "Telepon harus diisi"),
  email: z.string().email("Email tidak valid"),
  website: z.string().url("Website tidak valid"),
  logo_url: z.string().url("URL Logo tidak valid"),
});

const assigneeSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  nip: z.string().optional(),
  jabatan: z.string().min(1, "Jabatan harus diisi"),
  instansi: z.string().min(1, "Instansi harus diisi"),
});

const detailSchema = z.object({
  label: z.string().min(1, "Label harus diisi"),
  separator: z.string(),
  value: z.string().min(1, "Value harus diisi"),
});

const signerSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  nip: z.string().min(1, "NIP harus diisi"),
  jabatan: z.string().min(1, "Jabatan harus diisi"),
  instansi: z.string().min(1, "Instansi harus diisi"),
  pangkat: z.string().optional(),
});

const formSchema = z.object({
  nomor_surat: z.string().min(1, "Nomor surat harus diisi"),
  perihal: z.string().min(1, "Perihal harus diisi"),
  tanggal_surat: z.string(),
  tempat_surat: z.string(),
  pembuka: z.string().min(1, "Pembuka harus diisi"),
  penutup: z.string().min(1, "Penutup harus diisi"),
  school_info: schoolInfoSchema,
  assignees: z.array(assigneeSchema),
  details: z.array(detailSchema),
  penandatangan: signerSchema,
});

const defaultValues: z.infer<typeof formSchema> = {
  assignees: [
    {
      instansi: "SMK Negeri 2 Singosari",
      jabatan: "Guru",
      nama: "Inasni Dyah Rahmatika, S.Pd.",
      nip: "19850101 201001 2 005",
    },
  ],
  details: [
    {
      label: "Keperluan",
      separator: ":",
      value: "Pengantaran Siswa Praktik Kerja Lapangan (PKL)",
    },
    {
      label: "Hari / Tanggal",
      separator: ":",
      value: "Senin, 1 Juli 2026",
    },
    {
      label: "Waktu",
      separator: ":",
      value: "08.00 - Selesai",
    },
    {
      label: "Tempat",
      separator: ":",
      value: "BACAMALANG.COM",
    },
    {
      label: "Alamat",
      separator: ":",
      value: "JL. MOROJANTEK NO. 87 B, PANGENTAN, KEC. SINGOSARI, KAB. MALANG",
    },
  ],
  nomor_surat: "800/976/101.6.9.19/2025",
  pembuka:
    "Kepala SMK Negeri 2 Singosari Dinas Pendidikan Kabupaten Malang menugaskan kepada :",
  penandatangan: {
    instansi: "SMK Negeri 2 Singosari",
    jabatan: "Kepala SMK Negeri 2 Singosari",
    nama: "SUMIJAH, S.Pd., M.Si.",
    pangkat: "Pembina Utama Muda (IV/c)",
    nip: "19700210 199802 2 009",
  },
  penutup:
    "Demikian surat tugas ini dibuat untuk dilaksanakan dengan sebaik-baiknya dan melaporkan hasilnya kepada kepala sekolah.",
  perihal: "SURAT TUGAS",
  school_info: {
    alamat_jalan: "Jalan Perusahaan No. 20",
    email: "smkn2singosari@yahoo.co.id",
    kab_kota: "Kab. Malang",
    kecamatan: "Singosari",
    kelurahan: "Tunjungtirto",
    kode_pos: "65153",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/commons/7/74/Coat_of_arms_of_East_Java.svg",
    nama_sekolah: "SMK NEGERI 2 SINGOSARI",
    provinsi: "Jawa Timur",
    telepon: "(0341) 4345127",
    website: "www.smkn2singosari.sch.id",
  },
  tanggal_surat: "06 April 2026",
  tempat_surat: "Singosari",
};

const LetterPreview = ({ data }: { data: z.infer<typeof formSchema> }) => {
  console.log("Preview Data:", data.school_info.logo_url);
  return (
    <div className="bg-white p-10 w-[210mm] min-h-auto mx-auto text-black font-serif text-sm leading-relaxed shadow-lg">
      {/* Header / Kop */}
      <div className="flex items-center gap-4 border-b-4 border-double border-black pb-4 mb-6">
        <div className="w-[100px] flex-shrink-0 flex justify-center">
          {/* Placeholder for Logo if url exists, else generic */}
          {data.school_info?.logo_url ? (
            <img
              src={data.school_info.logo_url}
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
          ) : (
            <div className="w-20 h-20 border flex items-center justify-center">
              Logo
            </div>
          )}
        </div>
        <div className="text-center w-full uppercase">
          <h2 className="text-lg font-bold">
            PEMERINTAH PROVINSI {data.school_info.provinsi}
          </h2>
          <h2 className="text-lg font-bold">DINAS PENDIDIKAN</h2>
          <h1 className="text-2xl font-black tracking-wider">
            {data.school_info.nama_sekolah}
          </h1>
          <p className="normal-case text-xs mt-1">
            {data.school_info.alamat_jalan}
          </p>
          <p className="normal-case text-xs">
            Telepon {data.school_info.telepon}
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold underline uppercase">
          {data.perihal}
        </h2>
        <p>Nomor : {data.nomor_surat}</p>
      </div>

      {/* Body */}
      <div className="mb-4 text-justify">
        <p>{data.pembuka}</p>
      </div>

      {/* Assignees Table */}
      <div className="mb-6">
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100/50">
              <th className="border border-black p-2 w-12 text-center">NO</th>
              <th className="border border-black p-2 text-center">NAMA</th>
              <th className="border border-black p-2 text-center">JABATAN</th>
              <th className="border border-black p-2 text-center">DINAS</th>
            </tr>
          </thead>
          <tbody>
            {data.assignees && data.assignees.length > 0 ? (
              data.assignees.map((person, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-2 text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-black p-2">
                    <div className="font-bold">{person.nama}</div>
                    {/* {person.nip && <div className="text-xs">{person.nip}</div>} */}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {person.jabatan}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {person.instansi}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="border border-black p-4 text-center italic"
                >
                  Belum ada petugas ditambahkan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details */}
      <div className="ml-8 mb-6 space-y-1">
        {data.details &&
          data.details.map((detail, idx) => (
            <div key={idx} className="flex">
              <div className="w-32 flex-shrink-0">{detail.label}</div>
              <div className="w-4 flex-shrink-0 text-center">
                {detail.separator}
              </div>
              <div className="flex-1 font-medium">{detail.value}</div>
            </div>
          ))}
      </div>

      {/* Closing */}
      <div className="mb-12 text-justify">
        <p>{data.penutup}</p>
      </div>
      {/* Signature */}
      <div className="flex justify-end">
        <div className="w-[300px] text-left">
          <p>
            {data.tempat_surat}, {data.tanggal_surat}
          </p>
          <p className="font-bold mb-20">{data.penandatangan.jabatan}</p>

          <p className="font-bold underline uppercase">
            {data.penandatangan.nama}
          </p>
          <p>{data.penandatangan.pangkat}</p>
          <p>NIP. {data.penandatangan.nip}</p>
        </div>
      </div>
    </div>
  );
};

export default function CetakBuktiPage() {
  const params = useParams();
  const kegiatan_id = Number(params.kegiatan_id);

  const [dataSekolah, setDataSekolah] = useState<ApiResponseSekolah | null>(
    null,
  );
  const [dataJadwal, setDataJadwal] = useState<jadwalPkl | null>(null);
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [openCombobox, setOpenCombobox] = useState<number | null>(null); // Index of open combobox
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [isLoadingGuru, setIsLoadingGuru] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = (node: HTMLDivElement | null) => {
    if (isLoadingGuru) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  const fetchGurus = async (
    currentPage: number,
    searchTerm: string,
    reset: boolean = false,
  ) => {
    try {
      setIsLoadingGuru(true);
      const res = await getGuru(searchTerm, currentPage);
      if (res && res.data) {
        const newGurus = res.data.data;
        if (reset) {
          setGurus(newGurus);
        } else {
          setGurus((prev) => [...prev, ...newGurus]);
        }
        // Assuming API returns meta or check if result length < limit (e.g. 10)
        setHasMore(newGurus.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch gurus", error);
    } finally {
      setIsLoadingGuru(false);
    }
  };

  const getJadwalByIdHook = async () => {
    try {
      if (!kegiatan_id) return;
      const response = await kegiatanPklById(kegiatan_id);
      // Handle both direct data or nested data structure from API
      if (response && (response as any).data) {
        setDataJadwal((response as any).data);
      } else {
        setDataJadwal(response);
      }
    } catch (error) {
      console.error("Error fetching jadwal info:", error);
    }
  };

  // Initial load and search change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchGurus(1, debouncedSearch, true);
  }, [debouncedSearch]);

  // Load more when page changes (except reset)
  useEffect(() => {
    if (page > 1) {
      fetchGurus(page, debouncedSearch, false);
    }
  }, [page]);

  // Observer for infinite scroll (Removed in favor of callback ref)
  // useEffect(() => {
  //     const loadMoreTrigger = document.getElementById("load-more-trigger")
  //     if (loadMoreTrigger) {
  //         observer.observe(loadMoreTrigger)
  //     }
  //     return () => {
  //         if (loadMoreTrigger) observer.unobserve(loadMoreTrigger)
  //     }
  // }, [gurus, hasMore])

  const getDataSekolah = async () => {
    try {
      const response = await getSekolah();
      setDataSekolah(response);
    } catch (error) {
      console.error("Error fetching school info:", error);
    }
  };

  useEffect(() => {
    getDataSekolah();
    getJadwalByIdHook();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (dataSekolah && dataSekolah.success && dataSekolah.data) {
      const info = dataSekolah.data;

      // Populate School Info
      form.setValue("school_info.nama_sekolah", info.nama_sekolah);
      form.setValue("school_info.alamat_jalan", info.jalan);
      form.setValue("school_info.kelurahan", info.kelurahan);
      form.setValue("school_info.kecamatan", info.kecamatan);
      form.setValue("school_info.kab_kota", info.kabupaten_kota);
      form.setValue("school_info.provinsi", info.provinsi);
      form.setValue("school_info.kode_pos", info.kode_pos);
      form.setValue("school_info.telepon", info.nomor_telepon);
      form.setValue("school_info.email", info.email);
      form.setValue("school_info.website", info.website);
      if (info.logo_url) {
        form.setValue(
          "school_info.logo_url",
          "https://upload.wikimedia.org/wikipedia/commons/7/74/Coat_of_arms_of_East_Java.svg",
        );
      }

      // Populate Penandatangan (Kepala Sekolah)
      form.setValue("penandatangan.nama", info.kepala_sekolah);
      form.setValue("penandatangan.nip", info.nip_kepala_sekolah);
      form.setValue("penandatangan.instansi", info.nama_sekolah);
      // Assuming simplified logic for Jabatan
      if (info.jenis_sekolah) {
        form.setValue("penandatangan.jabatan", `Kepala ${info.nama_sekolah}`);
      }
    }
  }, [dataSekolah, form]);

  useEffect(() => {
    if (dataJadwal) {
      const jenis = dataJadwal.jenis_kegiatan;
      let keperluan = "";

      if (jenis === "Pembekalan") {
        keperluan = "Pembekalan Siswa Praktik Kerja Lapangan (PKL)";
      } else if (jenis === "Pengantaran") {
        keperluan = "Pengantaran Siswa Praktik Kerja Lapangan (PKL)";
      } else if (jenis === "Monitoring1") {
        keperluan = "Monitoring I Siswa Praktik Kerja Lapangan (PKL)";
      } else if (jenis === "Monitoring2") {
        keperluan = "Monitoring II Siswa Praktik Kerja Lapangan (PKL)";
      } else if (jenis === "Penjemputan") {
        keperluan = "Penjemputan Siswa Praktik Kerja Lapangan (PKL)";
      } else {
        keperluan = `${jenis} Siswa Praktik Kerja Lapangan (PKL)`;
      }

      const currentDetails = form.getValues("details");
      const keperluanIndex = currentDetails.findIndex(
        (d) => d.label === "Keperluan",
      );

      if (keperluanIndex !== -1) {
        form.setValue(`details.${keperluanIndex}.value`, keperluan);
      } else {
        // If not found, maybe append or just ignore? standard form has it.
      }
    }
  }, [dataJadwal, form]);

  const {
    fields: assigneeFields,
    append: appendAssignee,
    remove: removeAssignee,
  } = useFieldArray({
    control: form.control,
    name: "assignees",
  });

  // We can treat 'details' as a field array too if we want dynamic details
  const {
    fields: detailFields,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({
    control: form.control,
    name: "details",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await postData(values);

      downloadPDF(response.filename);

      toast.success("Surat Tugas berhasil dicetak", {
        description: "File PDF berhasil diunduh.",
      });
    } catch (error) {
      toast.error("Gagal mencetak Surat Tugas", {
        description: "Terjadi kesalahan saat mencetak Surat Tugas.",
      });
      console.log(error);
    }
  }

  // console.log(dataGuruPembimbing)

  return (
    <div className="container mx-auto py-2 px-4 md:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cetak Surat Tugas
          </h1>
          <p className="text-muted-foreground">
            Formulir untuk mencetak Surat Tugas Pengantaran Siswa PKL.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Detail Surat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detail Surat
              </CardTitle>
              <CardDescription>
                Nomor, perihal, dan waktu surat.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nomor_surat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Surat</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="perihal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perihal</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                                control={form.control}
                                name="tempat_surat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tempat Surat</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tanggal_surat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Surat</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
              <FormField
                control={form.control}
                name="pembuka"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Kalimat Pembuka</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Petugas (Assignees) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Ditugaskan Kepada
                </CardTitle>
                <CardDescription>
                  Daftar guru/staf yang ditugaskan.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendAssignee({ nama: "", jabatan: "", instansi: "" })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Tambah Petugas
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {assigneeFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-start border p-4 rounded-md bg-muted/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <FormField
                      control={form.control}
                      name={`assignees.${index}.nama`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama</FormLabel>
                          <Popover
                            open={openCombobox === index}
                            onOpenChange={(open) => {
                              setOpenCombobox(open ? index : null);
                              if (!open) setSearch(""); // Reset search on close
                            }}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? gurus.find((g) => g.nama === field.value)
                                      ?.nama || field.value
                                    : "Pilih Guru Pembimbing"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[400px] p-0"
                              align="start"
                            >
                              <Command shouldFilter={false}>
                                <CommandInput
                                  placeholder="Cari guru..."
                                  value={search}
                                  onValueChange={setSearch}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {isLoadingGuru ? (
                                      <div className="flex items-center justify-center py-4">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                      </div>
                                    ) : (
                                      "Guru tidak ditemukan."
                                    )}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {gurus.map((guru) => (
                                      <CommandItem
                                        key={guru.id}
                                        value={guru.nama}
                                        onSelect={(currentValue) => {
                                          form.setValue(
                                            `assignees.${index}.nama`,
                                            guru.nama,
                                          );
                                          form.setValue(
                                            `assignees.${index}.nip`,
                                            guru.nip,
                                          );
                                          const instansi =
                                            dataSekolah?.data?.nama_sekolah ||
                                            "Sekolah";
                                          form.setValue(
                                            `assignees.${index}.instansi`,
                                            instansi,
                                          );
                                          setOpenCombobox(null);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            guru.nama === field.value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {guru.nama}
                                      </CommandItem>
                                    ))}
                                    {hasMore && (
                                      <div
                                        ref={lastElementRef}
                                        className="p-2 text-center text-xs text-muted-foreground"
                                      >
                                        {isLoadingGuru ? (
                                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                        ) : (
                                          "Load more..."
                                        )}
                                      </div>
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`assignees.${index}.nip`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIP (Opsional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="xxxxx" disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`assignees.${index}.jabatan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jabatan</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Guru" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`assignees.${index}.instansi`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instansi</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Sekolah" disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAssignee(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section: Detail Isi Surat */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Isi Tugas / Keterangan
                </CardTitle>
                <CardDescription>Rincian pelaksanaan tugas.</CardDescription>
              </div>
              {/* <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendDetail({ label: "", value: "", separator: ":" })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Tambah Baris
                            </Button> */}
            </CardHeader>
            <CardContent className="space-y-4">
              {detailFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`details.${index}.label`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="Label (e.g. Hari)" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="pb-3 text-muted-foreground">:</span>
                  <FormField
                    control={form.control}
                    name={`details.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-[2]">
                        <FormControl>
                          <Input {...field} placeholder="Isi Keterangan" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* <Button type="button" variant="ghost" size="icon" onClick={() => removeDetail(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button> */}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section: Penandatangan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Penandatangan
              </CardTitle>
              <CardDescription>
                Pejabat yang menandatangani surat.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="penandatangan.nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!dataSekolah} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="penandatangan.nip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIP</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!dataSekolah} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="penandatangan.jabatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!dataSekolah} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="penandatangan.pangkat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pangkat / Golongan</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="penutup"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Kalimat Penutup</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end pb-5 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="lg">
                  <Eye className="mr-2 h-5 w-5" />
                  Preview Surat
                </Button>
              </DialogTrigger>

              {/* Tambahkan class [&>button]:hidden di akhir daftar class kamu */}
              <DialogContent className="!fixed h-[100vh] p-0 bg-white border-none shadow-none focus:outline-none overflow-y-auto !max-w-[100vw]">
                <LetterPreview data={form.watch()} />
              </DialogContent>
            </Dialog>

            <Button type="submit" size="lg" className="w-full md:w-auto">
              <Printer className="mr-2 h-5 w-5" />
              Cetak Surat Tugas
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
