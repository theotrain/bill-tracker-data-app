export const dynamic = "force-dynamic"; // static by default, unless reading the request

export function GET(request) {
  fetch("https://bill-tracker-data-app.vercel.app/update");
  return new Response("Hello from api/update");
}
