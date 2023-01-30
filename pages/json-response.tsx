import { useEffect, useRef, useState } from "react";
import TerminalInputLine from "./terminal-input-line";
import _ from "lodash";

type JSONResponseProps = {
  data: string;
  onApiRouteClick: (route: string) => void;
};

export default function JSONResponse({
  data,
  onApiRouteClick,
}: JSONResponseProps) {
  const magicifyString = (str: string) => {
    if (str.startsWith("http") || str.startsWith("mailto"))
      return (
        <a className="underline" href={str}>
          {str}
        </a>
      );
    if (str.startsWith("/me/"))
      return (
        <a className="cursor-pointer" onClick={() => onApiRouteClick(str)}>
          {str}
        </a>
      );

    return str;
  };

  const prettify = (o: any, indent = 0, hasMore = false) => {
    let result;
    switch (typeof o) {
      case "string":
        result = (
          <span>
            <pre className="inline whitespace-pre-wrap text-green-900">
              "{magicifyString(o)}"
            </pre>
            {hasMore ? "," : ""}
          </span>
        );
        break;
      case "number":
        result = (
          <pre className="inline whitespace-pre-wrap text-green-900">
            o{hasMore ? "," : ""}
          </pre>
        );
        break;
      case "boolean":
        result = (
          <pre className="inline whitespace-pre-wrap text-green-900">
            o.toString(){hasMore ? "," : ""}
          </pre>
        );
        break;
      case "object":
        if (Array.isArray(o)) {
          result = (
            <div className="inline">
              <pre className="inline">{`[`}</pre>
              {o.map((item, idx) => (
                <span key={idx}>
                  <pre>
                    {" ".repeat((indent + 1) * 2)}
                    {prettify(item, indent + 1, idx < o.length - 1)}
                  </pre>
                </span>
              ))}
              <pre>
                {" ".repeat(indent * 2) + `]`}
                {hasMore ? "," : ""}
              </pre>
            </div>
          );
        } else {
          result = (
            <div className="inline">
              <pre className="inline">{`{`}</pre>
              {Object.keys(o).map((key: string, idx: number) => {
                const value = o[key];
                const isLast = idx === Object.keys(o).length - 1;
                return (
                  <div key={idx}>
                    <pre className="inline whitespace-pre-wrap">
                      {" ".repeat((indent + 1) * 2)}
                      <pre className="inline whitespace-pre-wrap text-blue-800">
                        "{key}"
                      </pre>
                      {`: `}
                    </pre>
                    <pre className="inline whitespace-pre-wrap">
                      {prettify(value, indent + 1, !isLast)}
                    </pre>
                  </div>
                );
              })}
              <pre>
                {" ".repeat(indent * 2) + `}`}
                {hasMore ? "," : ""}
              </pre>
            </div>
          );
        }
        break;
      default:
        result = o;
    }
    return <span>{result}</span>;
  };

  return (
    <div className="px-2 text-sm text-gray-500">
      <pre className="whitespace-pre-wrap">{prettify(JSON.parse(data))}</pre>
    </div>
  );
}
