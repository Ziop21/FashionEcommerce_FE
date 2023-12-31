import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getCurrentUserRoles } from './server/handler/AuthorizationHanlder';
import AuthenJwtDecoder from './utils/AuthenJwtDecoder';
import { AUTHORIZATION_TYPE, JWT_CART, JWT_COOKIE_NAME, JWT_REFRESH_COOKIE_NAME } from './config/ApplicationConfig';
import { RefreshTokenHandler } from './server/handler/AuthenticationHandler';
import { ERole } from './pages/api/admin/user/Models';
import add from '@/pages/api/guest/cart/add'

export async function middleware(request: NextRequest) {
  let rightResponse = NextResponse.rewrite(new URL(request.nextUrl.href));
  let wrongResponse = NextResponse.rewrite(new URL('/', request.nextUrl));
  const cartTokenCookie = request.cookies.get(JWT_CART);

  // rightResponse.cookies.set('withName', 'aaaa');
  // rightResponse.cookies.set('withoutName', 'aaaa', { sameSite: 'none', secure: true, expires: COOKIE_EXPIRED_DAY});


  if (cartTokenCookie === undefined) {
    try {
      // rightResponse.cookies.set('before', 'before call api')
      const cartToken = await add();
      rightResponse.cookies.set(JWT_CART, cartToken)
      wrongResponse.cookies.set(JWT_CART, cartToken)

      // rightResponse.cookies.set('after', 'after call api')
    } catch (error: any) {
      // rightResponse.cookies.set('error', error)
      console.error("Can not create cart token !!!");
    }
  }

  // rightResponse.cookies.set('end', 'end add cart')

  const jwtCookie = request.cookies.get(JWT_COOKIE_NAME)
  if (jwtCookie) {
    try {
      await AuthenJwtDecoder(jwtCookie.value);
    } catch (error: any) {
      if (error.name === 'JWTExpired') {
        try {
          console.error("JWT is expired");

          const refreshJWTCookie = request.cookies.get(JWT_REFRESH_COOKIE_NAME);
          if (refreshJWTCookie) {
            const jwt = await RefreshTokenHandler(refreshJWTCookie.value);
            if (jwt) {
              rightResponse.cookies.set(JWT_COOKIE_NAME, jwt)
            } else {
              wrongResponse.cookies.delete(JWT_COOKIE_NAME);
              wrongResponse.cookies.delete(JWT_REFRESH_COOKIE_NAME);
              console.error("send refresh token failed");
            }
          }
        } catch (error) {
          wrongResponse.cookies.delete(JWT_COOKIE_NAME);
          wrongResponse.cookies.delete(JWT_REFRESH_COOKIE_NAME);
          console.error("Send refresh token faileed");
        }
      }
    }
  }

  let isAuthorized = true;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    isAuthorized = await authorize(request, ERole.ADMIN);
  }

  if (request.nextUrl.pathname.startsWith('/manager')) {
    isAuthorized = await authorize(request, ERole.MANAGER);
  }

  if (request.nextUrl.pathname.startsWith('/staff')) {
    isAuthorized = await authorize(request, ERole.STAFF);
  }

  if (request.nextUrl.pathname.startsWith('/customer')) {
    isAuthorized = await authorize(request, ERole.CUSTOMER);
  }
  if (isAuthorized) {
    return rightResponse;
  }
  return wrongResponse;
}

const authorize = async (request: NextRequest, roleName: string) => {
  const jwt = request.cookies.get(JWT_COOKIE_NAME)
  if (jwt) {
    try {
      const roles = await getCurrentUserRoles(jwt.value);
      if (!Array.isArray(roles) || roles === undefined || roles == null) {
        return false;
      }
      if (!roles.includes(roleName)) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}

export const config = {
  matcher: ['/:path*', '/admin/:path*', '/customer/:path*', '/staff/:path*', '/manager/:path*'],
}