import { NextResponse } from "next/server";

export const middleware = async (req) => {
  // Get requested page's path and check if it needs authorization cookie or not
  const { pathname } = req.nextUrl;

  // Routes that should be redirected from if user is already logged in
  const skipIfLoggedInRoutes = ["/login", "/register"];
  let skipIfLoggedIn = false;
  for (let route of skipIfLoggedInRoutes) {
    if (route === pathname) {
      skipIfLoggedIn = true;
      break;
    }
  }

  // Routes that require administrator access
  const adminRoutes = ["/users", "/healthcheck"];
  let isAdminOnly = false;
  for (let route of adminRoutes) {
    if (route === pathname) {
      isAdminOnly = true;
      break;
    }
  }

  const isHome = pathname === "/";

  // Route should be skipped if user is already logged in (login/register pages)
  if (skipIfLoggedIn) {
    // If user is already logged in, skip
    if (req.cookies.has("token"))
      return NextResponse.redirect(new URL("/", req.url));
    // Otherwise proceed
    else return NextResponse.next();
  }

  // Check if token cookie exists (user is logged in)
  else if (!req.cookies.has("token")) {
    if (!isHome) return NextResponse.redirect(new URL("/login", req.url));
    else return NextResponse.next();
  }

  try {
    // Send a request to the user-management service to verify the token
    const token = req.cookies.get("token");

    const response = await fetch("http://user-management:9000/api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token?.value}`, // Pass the token as a cookie
      },
    });
    const data = await response.json();

    if (response.ok) {
      // Token is valid, set user info in headers
      let res = NextResponse.next();
      if (isAdminOnly && !data.user.isAdmin) {
        res = NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Encode header values to Base64
      const encodedName = Buffer.from(data.user.name).toString("base64");
      const encodedEmail = Buffer.from(data.user.email).toString("base64");
      const encodedIsAdmin = Buffer.from(data.user.isAdmin.toString()).toString(
        "base64"
      );
      const encodedDate = Buffer.from(data.user.date).toString("base64");

      res.headers.set("x-user-name", encodedName);
      res.headers.set("x-user-email", encodedEmail);
      res.headers.set("x-user-isAdmin", encodedIsAdmin);
      res.headers.set("x-user-date", encodedDate);

      return res;
    } else if (response.status === 401) {
      // Token is invalid
      throw new Error("Invalid token");
    } else if (data.message) {
      // Other message from user-management API
      throw new Error(data.message);
    } else {
      throw new Error("Something went wrong");
    }
  } catch (e) {
    // Authorization failed - Force remove user's token
    const res = NextResponse.redirect(new URL("/", req.url));
    res.headers.set("x-middleware-cache", "no-cache");
    res.cookies.set({
      name: "token",
      value: "",
      maxAge: 0,
    });
    return res;
  }
};

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/credits(.*)",
    "/submissions(.*)",
    "/problems(.*)",
    "/users(.*)",
    "/healthcheck(.*)",
    "/login",
    "/register",
    "/",
  ],
};
