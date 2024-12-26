"use client";
import { useState, useActionState, useEffect } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import styles from "./page.module.css";
import { getSheetData, updateDate } from "@/helper/process-sheet";

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

  const [updateDateMessage, updateDateAction, updateDateIsPending] =
    useActionState(updateDate, null);

  let dateUpdatedFlag = false;
  // let data = new FormData(dateForm);
  let d = new Date();

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

  useEffect(() => {
    if (
      !dateUpdatedFlag &&
      !legislatorsIsPending &&
      !newBillsIsPending &&
      !oldBillsIsPending
    ) {
      dateUpdatedFlag = true;
      // save the date by submitting date form
      let dateForm = document.getElementById("updateDate");
      // data.set("updated", dateFormatter.format(d));
      // data.set("updated_ms", d.getTime());
      dateForm.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  }, [legislatorsIsPending, newBillsIsPending, oldBillsIsPending]);

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

      {/* update date */}
      <form action={updateDateAction} id="updateDate">
        <input type="hidden" name="fileName" value="updated" />
        <input type="hidden" name="updated" value={dateFormatter.format(d)} />
        <input type="hidden" name="updated_ms" value={d.getTime()} />
        <p style={{ color: "grey" }}>
          {updateDateIsPending ? "" : updateDateMessage}
        </p>
      </form>
    </div>
  );
}
