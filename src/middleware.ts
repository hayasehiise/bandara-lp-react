import { withAuth } from "next-auth/middleware";

export default withAuth({
  // ke mana user dialihkan jika belum login
  pages: { signIn: "/login" },
});

/**
 * Middleware hanya dijalankan pada URL yang cocok dengan pola ini.
 * Semua path di luar /dashboard/* tidak diproses, sehingga tetap publik.
 */
export const config = {
  matcher: ["/dashboard/:path*"], // ⬅️  cuma /dashboard dan turunannya
};
