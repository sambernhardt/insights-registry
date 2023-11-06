import { InsightsRegistry } from "./insightRegistry";
import {
  outlierGroupPercentageDifferenceOfAverage,
  zScoreSignificantOutlierGroup,
} from "./utils/outliers";
import { linearRegressionForecast } from "./utils/trends";
import { scoresDecreasing, scoresIncreasing } from "./data";
import { Dataset } from "./types";
import { repeatArrayItems } from "./utils/utils";

let datasets: Dataset[] = [
  {
    name: "Proficiency scores: Planning 1.1 (Good)",
    data: scoresIncreasing,
    valueGetter: (item) => item.score,
    groupings: [
      {
        name: "School",
        getter: (item) => item.school,
      },
      {
        name: "Student",
        getter: (item) => item.first_name,
      },
    ],
  },
  {
    name: "Proficiency scores: Planning 2.1 (Bad)",
    data: scoresDecreasing,
    valueGetter: (item) => item.score,
    groupings: [
      {
        name: "School",
        getter: (item) => item.school,
      },
      {
        name: "Student",
        getter: (item) => item.first_name,
      },
    ],
  },
];
// datasets = repeatArrayItems(datasets, 100);

const registry = new InsightsRegistry();

datasets.forEach((dataset, idx) => {
  // | ------------------|
  // | Grouped insights |
  // | ------------------|

  dataset.groupings.forEach((grouping) => {
    // Eg. Group A is 10% higher than the average of all groups
    registry.register({
      id: idx,
      type: "percentage-difference-of-outlier-group",
      name: `${dataset.name} by ${grouping.name}`,
      dataset: dataset,
      generator: () =>
        outlierGroupPercentageDifferenceOfAverage(
          dataset.data,
          dataset.valueGetter,
          grouping.getter,
          ({ groupName, differencePercentage, positive }) => {
            return `[${
              grouping.name
            } ${groupName}] is ${differencePercentage.toFixed(2)}% ${
              positive ? "higher" : "lower"
            } than the average of all groups.`;
          }
        ),
    });

    // Eg. Group A is a significant outlier compared to the other groups
    registry.register({
      id: idx,
      type: "outlier-grouped",
      name: `${dataset.name} group of interest: ${grouping.name}`,
      dataset: dataset,
      generator: () =>
        zScoreSignificantOutlierGroup(
          dataset.data,
          dataset.valueGetter,
          grouping.getter
        ),
    });
  });

  // | ------------|
  // | Trends |
  // | ------------|

  // Eg. For the past 30 days, the data has been trending upwards
  registry.register({
    id: idx,
    type: "linear-regression-recent-trend",
    name: `${dataset.name} over time`,
    dataset: dataset,
    generator: () =>
      linearRegressionForecast(
        dataset.data,
        (item) => item.score,
        (item) => new Date(item.submission_date)
      ),
  });

  // Eg. "There is a clear seasonal pattern, with higher values consistently occurring during the summer months."
  // registry.register({
  //   type: "seasonal-clumping",
  //   name: `${dataset.name} over time`,
  //   dataset: dataset,
  //   generator: () =>
  //     findSeasonalClumping(
  //       dataset.data,
  //       (item) => item.score,
  //       (item) => new Date(item.submission_date)
  //     ),
  // });

  // Eg. "There is a noticeable change in the data trend starting from date Z."
  // registry.register({
  //   type: 'data-shift',
  //   name: `${dataset.name} over time`,
  //   dataset: dataset,
  //   generator: () => findDataShift(
  //     dataset.data,
  //     (item) => item.score,
  //     (item) => new Date(item.submission_date)
  //   )
  // })

  // Eg. "Group A has a significantly higher average score than Group B."
  // registry.register({
  //   type: 'group-comparison-average-value',
  //   name: `${dataset.name} over time`,
  //   dataset: dataset,
  //   generator: () => outlierGrouped(
  //     dataset.data,
  //     (item) => item.score,
  //     (item) => new Date(item.submission_date)
  //   )
  // })

  // Eg. "Over the last year, Group A has consistently outperformed Group B, showing a clear upward trend."
  // registry.register({
  //   type: 'historical-comparison-grouped',
  //   name: `${dataset.name} over time`,
  //   dataset: dataset,
  //   generator: () => linearRegressionForecast(
  //     dataset.data,
  //     (item) => item.score,
  //     (item) => new Date(item.submission_date)
  //   )
  // })

  // Eg. "Group D is expected to experience a 10% increase in scores over the next quarter based on historical trends."
  // registry.register({
  //   type: 'linear-regression-forecast-for-group',
  //   name: `${dataset.name} over time`,
  //   dataset: dataset,
  //   generator: () => linearRegressionForecast(
  //     dataset.data,
  //     (item) => item.score,
  //     (item) => new Date(item.submission_date)
  //   )
  // })
});

const insights = registry.generateInsights();
console.log(insights);
