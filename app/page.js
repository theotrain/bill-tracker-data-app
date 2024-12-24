"use client";
import { useState, useActionState, useEffect } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import styles from "./page.module.css";
import { getSheetData, saveData } from "@/helper/process-sheet";

export default function Home() {
  const [newBillsMessage, newBillsAction, newBillsIsPending] = useActionState(
    getSheetData,
    null
  );

  const [oldBillsMessage, oldBillsAction, oldBillsIsPending] = useActionState(
    getSheetData,
    null
  );

  const [legislatorsMessage, legislatorsAction, legislatorsIsPending] =
    useActionState(getSheetData, null);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZoneName: "short",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });

  const newBillsCutoffDate = () => {
    //return a date formatted '2021-08-1' to use in SQL query
    var millisecondsPerDay = 86400000;
    var millisecondsInNineMonths = 365 * 1.5 * millisecondsPerDay;
    var today = new Date();
    var cutoffDate = new Date(today.getTime() - millisecondsInNineMonths);
    return `${cutoffDate.getFullYear()}-${cutoffDate.getMonth()}-${cutoffDate.getDate()}`;
  };

  const cutoffDateString = newBillsCutoffDate();

  useEffect(() => {
    // SUBMIT ALL FORMS
    document
      .getElementById("newBills")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    document
      .getElementById("oldBills")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    document
      .getElementById("legislators")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  }, []);

  // if (sheetName == "legislators") {
  //    let d = new Date();
  //   saveData("updated", { updated: dateFormatter.format(d), updated_ms: d.getTime });
  // }
  function updatedDate() {
    // save the date and return it in human-readable format
    let d = new Date();
    let human = dateFormatter.format(d);
    saveData("updated", { updated: human, updated_ms: d.getTime() });
    return human;
  }

  return (
    <div>
      {/* get new bills */}
      <form action={newBillsAction} id="newBills">
        <input type="hidden" name="sheetName" value="bills" />
        <input
          type="hidden"
          name="query"
          value={`SELECT * WHERE H > date '${cutoffDateString}' ORDER BY H DESC`}
        />
        <input type="hidden" name="fileName" value="bills1" />
        <input
          type="hidden"
          name="responseMessage"
          value="new bills updated ✔"
        />
        <h4>
          {newBillsIsPending ? "updating newer bills..." : newBillsMessage}
        </h4>
      </form>

      {/* get old bills */}
      <form action={oldBillsAction} id="oldBills">
        <input type="hidden" name="sheetName" value="bills" />
        <input
          type="hidden"
          name="query"
          value={`SELECT * WHERE H <= date '${cutoffDateString}' ORDER BY H DESC`}
        />
        <input type="hidden" name="fileName" value="bills2" />
        <input
          type="hidden"
          name="responseMessage"
          value="old bills updated ✔"
        />
        <h4>
          {oldBillsIsPending ? "updating older bills..." : oldBillsMessage}
        </h4>
      </form>

      {/* get legislators */}
      <form action={legislatorsAction} id="legislators">
        <input type="hidden" name="sheetName" value="legislators" />
        <input type="hidden" name="query" value="SELECT * ORDER BY B ASC" />
        <input type="hidden" name="fileName" value="legislators" />
        <input
          type="hidden"
          name="responseMessage"
          value="legislators updated ✔"
        />
        <h4>
          {legislatorsIsPending
            ? "updating legislators..."
            : legislatorsMessage}
        </h4>
      </form>
      {!legislatorsIsPending && !newBillsIsPending && !oldBillsIsPending
        ? updatedDate()
        : ""}
    </div>
  );
}
