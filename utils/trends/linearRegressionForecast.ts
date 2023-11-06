import moment from "moment";
import { getFileContents } from "../utils";
import { linearRegression } from "simple-statistics";
import { Dataset } from "../../types";

const linearRegressionForecast = ({
  dataset,
}: {
  dataset: Dataset;
  writeInsight;
}) => {
  const { data, valueGetter, dateGetter } = dataset;

  if (!valueGetter(data[0])) {
    throw new Error("Value getter must return a number");
  }
  if (!dateGetter(data[0])) {
    throw new Error("Date getter must return a Date");
  }

  // Get the x and y values
  const dataPoints = data
    .map(
      (item) =>
        [moment(dateGetter(item)).unix(), valueGetter(item)] as [number, number]
    )
    .sort((a, b) => a[0] - b[0]);

  const normalizedDataPoints = dataPoints.map((item) => [
    item[0] - dataPoints[0][0],
    item[1],
  ]);

  // Get the linear regression using simple-statistics
  let { m, b } = linearRegression(normalizedDataPoints);

  const getDateRangeOfData = () => {
    const firstDate = moment(dateGetter(data[0]));
    const lastDate = moment(dateGetter(data[data.length - 1]));
    const dateRange = lastDate.diff(firstDate, "days");
    return dateRange;
  };

  const result = `For the past ${getDateRangeOfData()} days, the data has been trending ${
    m > 0 ? "upwards" : "downwards"
  }.`;

  return result;
};

export default linearRegressionForecast;
