import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { jwt } from '../../utils';


export async function middleware(req: NextRequest, ev: NextFetchEvent) {
 
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
   
    console.log({ session })
   
    if (!session) {
      const url = req.nextUrl.clone()
      const requestedPage = req.page.name
      url.pathname = `/auth/login`
      url.search = `?p=${requestedPage}`
      return NextResponse.redirect(url)
    }
   
    return NextResponse.next()
  }

