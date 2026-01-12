"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TahunAjaran } from "@/types/api"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    nama: z.string().min(2, {
        message: "Nama tahun ajaran minimal 2 karakter.",
    }),
    kode: z.string().min(2, {
        message: "Kode tahun ajaran minimal 2 karakter.",
    }),
    is_active: z.boolean(),
})

interface TahunAjaranFormProps {
    initialData?: TahunAjaran
    onSubmit: (values: z.infer<typeof formSchema>) => void
    isLoading?: boolean
    title: string
    description: string
}

export function TahunAjaranForm({
    initialData,
    onSubmit,
    isLoading,
    title,
    description
}: TahunAjaranFormProps) {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: initialData?.nama || "",
            kode: initialData?.kode || "",
            is_active: initialData?.is_active || false,
        },
    })

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="nama"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Tahun Ajaran</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: 2023/2024" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="kode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kode</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: TA2324" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-4 justify-end">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
