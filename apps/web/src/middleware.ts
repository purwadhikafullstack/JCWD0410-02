import { auth } from '@/lib/auth';

const loggedOutRoutes = [
  '/login',
  '/register',
  '/reset-password',
  '/forgot-password',
];

const loggedInRoutes = [
  '/orderlist',
  '/profile',
  '/change-email',
  '/change-password',
];
const privateRoutes = ['/dashboard'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isLoggedOutRoute = loggedOutRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isLoggedInRoute = loggedInRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect unauthenticated users to login if they are accessing private routes
  if ((req.auth?.user.role === 'USER' || !req.auth) && isPrivateRoute) {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // Redirect authenticated users away from loggedOutRoutes
  if (req.auth && isLoggedOutRoute) {
    const newUrl = new URL('/', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (!req.auth && isLoggedInRoute) {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
