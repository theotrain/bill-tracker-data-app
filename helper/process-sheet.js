"use server";
// const fs = require("fs");
import { put } from "@vercel/blob";

function saveData(file, data) {
  const blob = put(file + ".json", JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: 20,
  });
}

// function saveData(file, data) {
//   file = "./public/data/" + file + ".json";
//   fs.writeFileSync(file, JSON.stringify(data));
// }

const responseToObjects = (res) => {
  const jsData = JSON.parse(res.substring(47).slice(0, -2));
  let data = [];
  const columns = jsData.table.cols;
  const rows = jsData.table.rows;
  let rowObject;
  let cellData;
  let propName;
  for (let r = 0, rowMax = rows.length; r < rowMax; r++) {
    rowObject = {};
    for (let c = 0, colMax = columns.length; c < colMax; c++) {
      cellData = rows[r]["c"][c];
      propName = columns[c].label;
      if (cellData === null) {
        rowObject[propName] = "";
      } else if (
        typeof cellData["v"] == "string" &&
        cellData["v"].startsWith("Date")
      ) {
        rowObject[propName] = new Date(cellData["f"]);
      } else {
        rowObject[propName] = cellData["v"];
      }
    }
    data.push(rowObject);
  }
  return data;
};

export async function updateDate(prevState, formData) {
  const updated = formData.get("updated");
  const updated_ms = formData.get("updated_ms");
  const fileName = formData.get("fileName");
  const responseMessage = formData.get("responseMessage");
  saveData(fileName, { updated: updated, updated_ms: updated_ms });
  return updated;
}

// export const getSheetData = ({ sheetName, query, callback }) => {
export async function getSheetData(prevState, formData) {
  const sheetName = formData.get("sheetName");
  const query = formData.get("query");
  const fileName = formData.get("fileName");
  const responseMessage = formData.get("responseMessage");

  const sheetID = "1fgCgR9u4ntm8x2-oTg4xZUmw_A2RixSsvqd_OV_y-Ok";
  const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
  const url = `${base}&sheet=${sheetName}&tq=${encodeURIComponent(query)}`;
  const data = [];

  fetch(url)
    .then((res) => res.text())
    .then((response) => {
      saveData(fileName, responseToObjects(response));
    });

  return responseMessage;
}
