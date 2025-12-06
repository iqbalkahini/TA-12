"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGuruData } from "./useGuruData";
import { useAuth } from "./useAuth";
// import { getGuruDefaultPath } from "@/utils/roleHelpers";

type GuruRole = "kapro" | "koordinator" | "wali-kelas" | "pembimbing";

// Hook untuk cek dan enforce hak akses berdasarkan role
export const useRoleAccess = (requiredRole: GuruRole) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { guruData, loading } = useGuruData();

  useEffect(() => {
    if (loading) return;

    // Jika tidak ada guruData, redirect ke login
    if (!guruData && isLoggedIn) {
      router.push("/unauthorized");
      return;
    }

    if (!guruData) {
      router.push("/login");
      return;
    }

    // Mapping role ke property di guruData
    const roleMapping = {
      kapro: guruData.is_kaprog,
      koordinator: guruData.is_koordinator,
      "wali-kelas": guruData.is_wali_kelas,
      pembimbing: guruData.is_pembimbing,
    };

    const hasAccess = roleMapping[requiredRole];

    // Jika tidak punya akses, redirect ke dashboard role yang dimiliki
    if (!hasAccess) {
      // const defaultPath = getGuruDefaultPath({
      //   is_kaprog: guruData.is_kaprog,
      //   is_koordinator: guruData.is_koordinator,
      //   is_wali_kelas: guruData.is_wali_kelas,
      //   is_pembimbing: guruData.is_pembimbing,
      // });

      router.push("/unauthorized");
    }
  }, [guruData, loading, requiredRole, router, isLoggedIn]);

  return {
    hasAccess: guruData ? checkRoleAccess(guruData, requiredRole) : false,
    loading,
    guruData,
  };
};

// Helper function untuk cek apakah guru punya akses ke role tertentu
export const checkRoleAccess = (
  guruData: {
    is_kaprog?: boolean;
    is_koordinator?: boolean;
    is_wali_kelas?: boolean;
    is_pembimbing?: boolean;
  },
  requiredRole: GuruRole
): boolean => {
  const roleMapping = {
    kapro: guruData.is_kaprog,
    koordinator: guruData.is_koordinator,
    "wali-kelas": guruData.is_wali_kelas,
    pembimbing: guruData.is_pembimbing,
  };

  return roleMapping[requiredRole] || false;
};
