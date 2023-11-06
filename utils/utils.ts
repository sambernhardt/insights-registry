import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

export async function getFileContents<T>(filePath, headers) {
  return new Promise<T[]>((resolve, reject) => {
    const csvFilePath = path.resolve(__dirname, filePath);

    // id,first_name,last_name,school,score
    const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

    parse(
      fileContent,
      {
        delimiter: ",",
        columns: headers,
        cast: true,
      },
      (error, result: T[]) => {
        if (error) {
          reject(error);
        }

        // Remove first row (headers)
        result.shift();
        resolve(result);
      }
    );
  });
}

export async function getCSVContents<T>(fileContent) {
  return new Promise<T[]>((resolve, reject) => {
    const contents = fileContent.trim();
    const headerRow = contents.split("\n")[0].split(",");
    const body = contents.split("\n").slice(1).join("\n");

    parse(
      body,
      {
        delimiter: ",",
        columns: headerRow,
        cast: true,
      },
      (error, result: T[]) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      }
    );
  });
}

export function uniqueArrayItems(array) {
  return array.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

export function repeatArrayItems(array, times) {
  let result = [];
  for (let i = 0; i < times; i++) {
    result = result.concat(array);
  }
  return result;
}
