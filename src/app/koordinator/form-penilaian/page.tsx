"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Edit,
    CheckCircle2,
    Trash2,
    FileText,
    ListPlus,
    FileSearch,
} from "lucide-react";
import { koordinatorPenilaianApi } from "@/api/penilaian";
import { PenilaianForm, CreatePenilaianFormPayload } from "@/types/penilaian";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function FormulirPenilaianPage() {
    const [forms, setForms] = useState<PenilaianForm[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Form Data States
    const [selectedForm, setSelectedForm] = useState<PenilaianForm | null>(null);
    const [formNama, setFormNama] = useState("");
    const [formItems, setFormItems] = useState<{ urutan: number; tujuan_pembelajaran: string }[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            setLoading(true);
            const res = await koordinatorPenilaianApi.getForms();
            // Assuming res contains data array
            setForms(res.data || []);
        } catch (error) {
            console.error("Failed to fetch forms:", error);
            toast.error("Gagal mengambil data formulir penilaian");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setSelectedForm(null);
        setFormNama("");
        setFormItems([{ urutan: 1, tujuan_pembelajaran: "" }]);
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (form: PenilaianForm) => {
        setSelectedForm(form);
        setFormNama(form.nama);
        setFormItems(
            form.items.map((item) => ({
                urutan: item.urutan,
                tujuan_pembelajaran: item.tujuan_pembelajaran,
            }))
        );
        setIsFormModalOpen(true);
    };

    const handleOpenDetail = (form: PenilaianForm) => {
        setSelectedForm(form);
        setIsDetailModalOpen(true);
    };

    const handleOpenActivate = (form: PenilaianForm) => {
        setSelectedForm(form);
        setIsActivateModalOpen(true);
    };

    const handleAddItem = () => {
        setFormItems((prev) => [
            ...prev,
            { urutan: prev.length + 1, tujuan_pembelajaran: "" },
        ]);
    };

    const handleRemoveItem = (index: number) => {
        setFormItems((prev) => {
            const newItems = [...prev];
            newItems.splice(index, 1);
            // Re-adjust urutan
            return newItems.map((item, idx) => ({ ...item, urutan: idx + 1 }));
        });
    };

    const handleItemChange = (index: number, value: string) => {
        setFormItems((prev) => {
            const newItems = [...prev];
            newItems[index].tujuan_pembelajaran = value;
            return newItems;
        });
    };

    const handleSubmitForm = async () => {
        if (!formNama.trim()) {
            toast.warning("Nama formulir harus diisi");
            return;
        }
        const validItems = formItems.filter((i) => i.tujuan_pembelajaran.trim() !== "");
        if (validItems.length === 0) {
            toast.warning("Minimal satu indikator harus diisi");
            return;
        }

        try {
            setSubmitting(true);
            const payload: CreatePenilaianFormPayload = {
                nama: formNama,
                items: validItems,
            };

            if (selectedForm) {
                await koordinatorPenilaianApi.updateForm(selectedForm.id, payload);
                toast.success("Formulir penilaian berhasil diubah");
            } else {
                await koordinatorPenilaianApi.createForm(payload);
                toast.success("Formulir penilaian berhasil dibuat");
            }
            setIsFormModalOpen(false);
            fetchForms();
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Terjadi kesalahan saat menyimpan formulir");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleActivate = async () => {
        if (!selectedForm) return;
        try {
            setSubmitting(true);
            await koordinatorPenilaianApi.activateForm(selectedForm.id);
            toast.success("Formulir berhasil diaktifkan");
            setIsActivateModalOpen(false);
            fetchForms();
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Terjadi kesalahan saat mengaktifkan formulir");
            }
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="px-5 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Formulir Penilaian</h2>
                    <p className="text-muted-foreground">
                        Kelola tujuan pembelajaran (indikator) untuk formulir penilaian PKL siswa.
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Buat Formulir Baru
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle>Daftar Formulir</CardTitle>
                    <CardDescription>Pilih formulir yang aktif digunakan untuk penilaian saat ini.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[50px] text-center">No</TableHead>
                                    <TableHead>Nama Formulir</TableHead>
                                    <TableHead className="text-center">Jml Indikator</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tgl Dibuat</TableHead>
                                    <TableHead className="text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            Memuat data formulir...
                                        </TableCell>
                                    </TableRow>
                                ) : forms.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Belum ada formulir penilaian yang dibuat.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    forms.map((form, index) => (
                                        <TableRow key={form.id}>
                                            <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-semibold">{form.nama}</TableCell>
                                            <TableCell className="text-center">{form.items?.length || 0} Item</TableCell>
                                            <TableCell>
                                                {form.is_active ? (
                                                    <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                                                        <CheckCircle2 className="h-3 w-3" /> Aktif
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Tidak Aktif</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(form.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric", month: "long", year: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        title="Detail / Lihat Indikator"
                                                        onClick={() => handleOpenDetail(form)}
                                                    >
                                                        <FileSearch className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        title="Edit Formulir"
                                                        onClick={() => handleOpenEdit(form)}
                                                        disabled={form.is_active} // Biasanya form aktif tidak boleh diedit logicnya, tp opsional
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {!form.is_active && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                            onClick={() => handleOpenActivate(form)}
                                                        >
                                                            Gunakan
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* MODAL: CREATE / EDIT FORM */}
            <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedForm ? "Ubah Formulir Penilaian" : "Buat Formulir Baru"}
                        </DialogTitle>
                        <DialogDescription>
                            Tentukan nama formulir dan rinci indikator tujuan pembelajaran yang akan dinilai.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4 overflow-y-auto pr-2">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Formulir</Label>
                            <Input
                                id="nama"
                                placeholder="cth: Penilaian Semester 5 Tahun 2026"
                                value={formNama}
                                onChange={(e) => setFormNama(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <Label>Daftar Tujuan Pembelajaran (Indikator)</Label>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="gap-2 h-8">
                                    <ListPlus className="h-3 w-3" /> Tambah Indikator
                                </Button>
                            </div>

                            {formItems.length === 0 ? (
                                <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground text-sm">
                                    Belum ada indikator. Klik Tambah Indikator.
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {formItems.map((item, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <div className="flex items-center justify-center w-8 h-10 bg-muted/50 rounded-md font-medium text-sm shrink-0 border">
                                                {item.urutan}
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    placeholder="Masukkan deskripsi tujuan pembelajaran..."
                                                    value={item.tujuan_pembelajaran}
                                                    onChange={(e) => handleItemChange(index, e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="shrink-0"
                                                onClick={() => handleRemoveItem(index)}
                                                disabled={formItems.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsFormModalOpen(false)} disabled={submitting}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmitForm} disabled={submitting}>
                            {submitting ? "Menyimpan..." : "Simpan Formulir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL: DETAIL FORM */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Detail Formulir Penilaian</DialogTitle>
                        <DialogDescription>
                            {selectedForm?.nama}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 overflow-y-auto pr-2 flex flex-col gap-3">
                        {selectedForm?.items?.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 p-3 bg-muted/30 border rounded-md">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-bold text-sm shrink-0">
                                    {item.urutan}
                                </div>
                                <p className="text-sm leading-relaxed pt-1">
                                    {item.tujuan_pembelajaran}
                                </p>
                            </div>
                        ))}
                        {(!selectedForm?.items || selectedForm.items.length === 0) && (
                            <p className="text-center text-muted-foreground py-4">Tidak ada indikator tercatat.</p>
                        )}
                    </div>
                    <DialogFooter className="pt-2 border-t mt-auto">
                        <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL: ACTIVATE FORM */}
            <Dialog open={isActivateModalOpen} onOpenChange={setIsActivateModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Aktifkan Formulir?</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menggunakan formulir <strong>{selectedForm?.nama}</strong> sebagai formulir penilaian PKL aktif?
                            <br /><br />
                            <span className="text-orange-600 dark:text-orange-400">
                                Catatan: Formulir lain yang sedang aktif akan otomatis dinonaktifkan.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsActivateModalOpen(false)} disabled={submitting}>
                            Batal
                        </Button>
                        <Button onClick={handleActivate} className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                            {submitting ? "Memproses..." : "Ya, Aktifkan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}