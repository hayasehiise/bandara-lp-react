import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// hanya proteksi route API, karena dashboard sudah aman dari komponen
export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
