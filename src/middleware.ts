import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getCurrentUserRoles } from './server/handler/AuthorizationHanlder';
import AuthenJwtDecoder from './utils/AuthenJwtDecoder';
import { COOKIE_EXPIRED_DAY, JWT_CART, JWT_COOKIE_NAME, JWT_REFRESH_COOKIE_NAME } from './config/ApplicationConfig';
import { RefreshTokenHandler } from './server/handler/AuthenticationHandler';
import { ERole } from './pages/api/admin/user/Models';
import add from '@/pages/api/guest/cart/add'
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies';

export async function middleware(request: NextRequest) {
  let rightResponse = NextResponse.rewrite(new URL(request.nextUrl.href));
  let wrongResponse = NextResponse.rewrite(new URL('/', request.nextUrl));
  const cartTokenCookie = request.cookies.get(JWT_CART);
  // const setRightCookies = new ResponseCookies(rightResponse.headers);
  // const setWrongCookies = new ResponseCookies(wrongResponse.headers);
  
  // const options = {
  //   name: 'yourKey',
  //   value: 'yourValue',
  //   cookie: {
  //     name: 'yourName',
  //     options: {
  //       domain: '',
  //       sameSite: 'none', // Đặt SameSite thành "none" nếu cần
  //       path: '/',
  //       expires: new Date().setHours(10),
  //     },
  //   },
  // };
  
  rightResponse.cookies.set('withName', 'aaaa', {sameSite: 'none', secure: true, expires: COOKIE_EXPIRED_DAY});
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

  const jwt = request.cookies.get(JWT_COOKIE_NAME)
  if (jwt) {
    try {
      await AuthenJwtDecoder(jwt.value);
    } catch (error: any) {
      if (error.name === 'JWTExpired') {
        try {
          console.error("JWT is expired");
          const jwt = await RefreshTokenHandler();
          if (jwt) {
            // let response = NextResponse.redirect(new URL(request.nextUrl.href));
            rightResponse.cookies.set(JWT_COOKIE_NAME, jwt)
          } else {
            // let response =  NextResponse.rewrite(new URL('/login', request.nextUrl));
            wrongResponse.cookies.delete(JWT_COOKIE_NAME);
            wrongResponse.cookies.delete(JWT_REFRESH_COOKIE_NAME);
            console.error("send refresh token failed");
          }
        } catch (error) {
          // let response = NextResponse.rewrite(new URL('/login', request.nextUrl));
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