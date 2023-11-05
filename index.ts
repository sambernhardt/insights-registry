import { outlierGroupPercentageDifferenceOfAverage } from "./utils/outliers/outlierGroupPercentageDifferenceOfAverage";
import { getFileContents, repeatArrayItems } from "./utils/utils";
import { zScoreSignificantOutlierGroup } from "./utils/outliers/zScoreSignificantOutlierGroup";
import { InsightsRegistry } from "./insightRegistry";

console.clear();

type Submission = {
  id: number;
  first_name: string;
  last_name: string;
  school: string;
  score: number;
};

let dataset1 = await getFileContents("../data.csv", [
  "id",
  "first_name",
  "last_name",
  "school",
  "score",
]);
let dataset2 = await getFileContents("../data-1.csv", [
  "id",
  "first_name",
  "last_name",
  "school",
  "score",
]);
let orderTotals = await getFileContents("../order-totals.csv", [
  "order_id",
  "name",
  "order_total",
]);

let datasets = [
  {
    name: "PD Feedback Scores",
    data: repeatArrayItems(dataset1, 1),
    valueGetter: (item: Submission) => item.score,
    groupings: [
      (item: Submission) => item.school,
      (item: Submission) => item.first_name,
    ],
  },
  {
    name: "Walkthrough Scores",
    data: repeatArrayItems(dataset2, 1),
    valueGetter: (item: Submission) => item.score,
    groupings: [
      (item: Submission) => item.school,
      (item: Submission) => item.first_name,
    ],
  },
  {
    name: "Order data",
    data: repeatArrayItems(orderTotals, 1),
    valueGetter: (item: any) => item.order_total,
    groupings: [(item: any) => item.name],
  },
];
datasets = repeatArrayItems(datasets, 100);

// const writeInsight = ({ groupName, positive, differencePercentage }) =>
//   `${groupName} scored ${differencePercentage.toFixed(2)}% ${
//     positive ? "higher" : "lower"
//   } than the average of all other schools.`;

const registry = new InsightsRegistry();

datasets.forEach((dataset, idx) => {
  dataset.groupings.forEach((grouping) => {
    registry.register(
      ["average-difference", dataset.name, idx, grouping].join("-"),
      () =>
        outlierGroupPercentageDifferenceOfAverage(
          dataset.data,
          dataset.valueGetter,
          grouping
        )
    );
    registry.register(
      ["zscore-outlier", dataset.name, idx, grouping].join("-"),
      () =>
        zScoreSignificantOutlierGroup(
          dataset.data,
          dataset.valueGetter,
          grouping
        )
    );
  });
});

const insights = registry.getInsights();

const totalRows = datasets.reduce(
  (acc, dataset) => acc + dataset.data.length,
  0
);

console.log(
  `Created ${insights.length.toLocaleString()} insights for ${datasets.length.toLocaleString()} datasets with ${totalRows.toLocaleString()} rows of data.`
);
