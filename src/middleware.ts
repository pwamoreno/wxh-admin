import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/:path*",
])

export default clerkMiddleware((auth, request) => {
  if(!isPublic(request)){
    auth().protect()
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};




// const isPublic = createRouteMatcher([
//   // "/sign-in(.*)",
//   // "/sign-up(.*)",
//   "/api(.*)"
// ])

// // export default clerkMiddleware((auth, request) => {
// //   if(!isPublic(request)){
// //     auth().protect()
// //   }
// // });

// export default clerkMiddleware(async (auth, request) => {
//   // console.log('Requested URL:', request.nextUrl.pathname);
//   // console.log('Is public route:', isPublic(request));

//    if (isPublic(request)) {
//     // console.log('Public route access:', request.nextUrl.pathname);
//     return;
//   }

//   auth().protect()
//   // The route is protected and the user has a valid session
//   // console.log('Protected route access granted');
// });