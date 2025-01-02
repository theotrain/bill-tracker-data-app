export const dynamic = "force-dynamic"; // static by default, unless reading the request
import { getSheetData, updateDate, connect } from "@/helper/process-sheet";

export function GET(request) {
  fetch("https://bill-tracker-data-app.vercel.app/update");
  return new Response(`Hello from api/update: ${connect()}`);
}
