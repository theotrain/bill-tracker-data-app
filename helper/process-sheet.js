"use server";
const fs = require("fs");

function saveData(file, data) {
  // "public/data/bills1.json"
  // console.log("SAVE DATA ------------------->");
  file = "public/data/" + file + ".json";
  // console.log("file: ", file);
  // console.log("data: ", data);
  fs.writeFileSync(file, JSON.stringify(data));
  // fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

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

// export const getSheetData = ({ sheetName, query, callback }) => {
export default async function getSheetData(prevState, formData) {
  // if (sheetName == "bills") {
  //   sheetName = "owen temp copy";
  // }

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
