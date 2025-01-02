export const dynamic = "force-dynamic"; // static by default, unless reading the request
import { getSheetData, updateDate, connect } from "@/helper/process-sheet";
import { waitUntil } from "@vercel/functions";
export const runtime = "edge";

// function doSomething() {
//   let promise = connect();
//   let result = await promise;
//   return result;
// }

export function GET() {
  // waitUntil(connect()));
  waitUntil(fetch("https://bill-tracker-data-app.vercel.app/update"));
  return new Response(`Hello from owen`);
  // doSomething().then((answer) => {
  //   return new Response(`Hello from api/update: ${answer}`);
  // });
}
