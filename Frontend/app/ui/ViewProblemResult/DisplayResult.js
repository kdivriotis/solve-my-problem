"use client";

import { useMemo } from "react";

import { typeOfExtended } from "@/app/lib/typeOfExtended";

const DisplayResult = ({ name, value }) => {
  const valueType = useMemo(() => typeOfExtended(value), [value]);
  const textClass = "text-xs md:text-sm xl:text-base";
  const valueClass = "text-primary dark:text-dark-primary";

  switch (valueType) {
    case "null":
      if (!name || name.trim() === "") return <></>;
      else
        return (
          <p className={textClass}>
            - <span className="capitalize">{name}: </span>
            <span className={valueClass}>null</span>
          </p>
        );
    case "date":
      const dateString = new Date(value).toLocaleDateString();
      const timeString = new Date(value).toLocaleTimeString();
      return (
        <p className={textClass}>
          - {name ? <span className="capitalize">{name}: </span> : ""}
          <span className={valueClass}>
            {dateString} {timeString}
          </span>
        </p>
      );
    case "array":
      // Only show the first 10 values of an array (don't flood the UI)
      const displayedValue = value.length > 10 ? value.slice(0, 10) : value;

      return (
        <>
          {name && name.trim() !== "" ? (
            <p className={textClass}>
              - <span className="capitalize">{name}:</span>
            </p>
          ) : (
            <></>
          )}
          <div className="ml-2 flex flex-col gap-1 md:gap-2">
            {displayedValue.map((v, index) => (
              <DisplayResult key={`${name}-${index}`} name={null} value={v} />
            ))}
            {displayedValue.length < value.length ? (
              <p className={textClass}>
                -{" "}
                <span className={valueClass}>
                  ... {value.length - displayedValue.length} more entries
                </span>
              </p>
            ) : (
              <></>
            )}
          </div>
        </>
      );
    case "object":
      const entries = Object.entries(value);

      return (
        <>
          {name && name.trim() !== "" ? (
            <p className={textClass}>
              - <span className="capitalize">{name}:</span>
            </p>
          ) : (
            <></>
          )}
          <div className="ml-2 flex flex-col gap-0">
            {entries.map((entry, index) => (
              <DisplayResult
                key={`${name}-${entry[0]}-${index}`}
                name={entry[0]}
                value={entry[1]}
              />
            ))}
          </div>
        </>
      );
    default:
      return (
        <p className={textClass}>
          - {name ? <span className="capitalize">{name}: </span> : ""}
          <span className={valueClass}>{value}</span>
        </p>
      );
  }
};

export default DisplayResult;
