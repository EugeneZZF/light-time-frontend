// import { NextRequest, NextResponse } from "next/server";

// function buildLoginUrl(request: NextRequest) {
//   const loginUrl = new URL("/admin/login", request.url);

//   if (request.nextUrl.pathname !== "/admin/login") {
//     loginUrl.searchParams.set("next", request.nextUrl.pathname);
//   }

//   return loginUrl;
// }

// export async function middleware(request: NextRequest) {
//   // const session = localStorage.getItem("admin_session")

//   const { pathname } = request.nextUrl;

//   if (pathname === "/admin/login") {
//     return NextResponse.redirect(new URL("/admin", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };
