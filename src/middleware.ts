import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import CryptoJS from "crypto-js";

// Kunci enkripsi untuk token (harus sama dengan yang di axios)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

// Fungsi untuk mendekripsi token
function decryptToken(encryptedToken: string): string | null {
  if (!encryptedToken || !ENCRYPTION_KEY) {
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch {
    return null;
  }
}

// Fungsi untuk mengecek apakah token masih valid
function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  try {
    // Decode JWT token untuk mengecek expiry
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Cek apakah token sudah expired
    return payload.exp > currentTime;
  } catch {
    // Jika error saat decode, berarti token tidak valid
    return false;
  }
}

// Fungsi untuk mendapatkan token dari cookie (terenkripsi)
function getTokenFromRequest(request: NextRequest): string | undefined {
  // Ambil encrypted token dari cookie
  const encryptedToken = request.cookies.get("accessToken")?.value;

  if (!encryptedToken) {
    return undefined;
  }

  // Dekripsi token
  const decryptedToken = decryptToken(encryptedToken);
  return decryptedToken || undefined;
}

// payload token secara dinamis
function getPayloadFromToken(token: string): any | null {
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    // Menggunakan atob agar kompatibel dengan middleware Next.js (Edge Runtime)
    const payload = JSON.parse(atob(base64Payload));
    return payload || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Daftar route yang memerlukan autentikasi
  const protectedRoutes = [
    "/admin",
    "/pembimbing",
    "/siswa",
    "/kapro",
    "/wali-kelas",
    "/koordinator",
  ];

  // Daftar route yang hanya bisa diakses jika belum login
  const authRoutes = ["/login", "/register"];

  // Ambil token dari cookie (terenkripsi dan didekripsi)
  const token = getTokenFromRequest(request);
  const isAuthenticated = isTokenValid(token);

  // Cek apakah user mencoba mengakses route yang dilindungi
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Cek apakah user mencoba mengakses route auth
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Jika user belum login dan mencoba akses protected route
  if (isProtectedRoute && !isAuthenticated) {
    console.log(
      "🔒 Unauthorized access to:",
      pathname,
      "-> Redirecting to login"
    );

    // Redirect ke halaman login dengan return URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Jika user sudah login dan mencoba akses auth route (login/register)
  if (isAuthRoute && isAuthenticated) {
    const payload = token ? getPayloadFromToken(token) : null;

    if (payload && payload.rl) {
      console.log(payload);
      // Redirect berdasarkan role (rl)
      switch (payload.rl.toLowerCase()) {
        case "adm":
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        case "ssw":
          return NextResponse.redirect(
            new URL("/siswa/dashboard", request.url)
          );
        case "gru":
          if (payload.is_kaprog) {
            return NextResponse.redirect(
              new URL("/kapro/dashboard", request.url)
            );
          }
          if (payload.is_koordinator) {
            return NextResponse.redirect(
              new URL("/koordinator/dashboard", request.url)
            );
          }
          if (payload.is_wali_kelas) {
            return NextResponse.redirect(
              new URL("/wali-kelas/dashboard", request.url)
            );
          }
          if (payload.is_pembimbing) {
            return NextResponse.redirect(
              new URL("/pembimbing/dashboard", request.url)
            );
          }
        default:
          return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Default redirect jika payload tidak ditemukan
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Log untuk debugging
  if (isProtectedRoute) {
    console.log("✅ Access granted to protected route:", pathname);
  }

  // Jika tidak ada kondisi khusus, lanjutkan request
  return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan route mana yang akan diproses middleware
export const config = {
  matcher: [
    /*
     * Match semua request paths kecuali:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (png, jpg, jpeg, gif, svg, ico)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
