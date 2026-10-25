import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

// точное совпадение или вложенный путь: /profile и /profile/edit, но не /profiled
const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => matchesRoute(pathname, route));
  const isPrivateRoute = privateRoutes.some(route => matchesRoute(pathname, route));

  if (!accessToken) {
    if (refreshToken) {
      // accessToken нет, но есть refreshToken: проверяем и обновляем сессию
      try {
        const data = await checkSession();
        const setCookie = data.headers['set-cookie'];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

          for (const cookieStr of cookieArray) {
            // name и value отделяем, остальные атрибуты идут в options
            const { name, value, ...options } = parseSetCookie(cookieStr);

            if (value) {
              cookieStore.set(name, value, options);
            }
          }

          // сессия активна: с публичных страниц отправляем в профиль
          if (isPublicRoute) {
            return NextResponse.redirect(new URL('/profile', request.url), {
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }
          // на приватные страницы пускаем
          if (isPrivateRoute) {
            return NextResponse.next({
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }
        }
      } catch {
        // сессия недействительна: обрабатываем как неавторизованного
      }
    }

    // нет токенов или сессии: публичные страницы доступны
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // приватные страницы: редирект на вход
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // accessToken есть: с публичных страниц отправляем в профиль
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // приватные страницы доступны
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
