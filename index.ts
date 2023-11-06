import { InsightsRegistry } from "./insightRegistry";
import { scoresDecreasingDataset, scoresIncreasingDataset } from "./data";
import { Dataset } from "./types";

let datasets: Dataset[] = [
  {
    name: "Proficiency scores: Planning 1.1",
    data: scoresIncreasingDataset,
    valueGetter: (item) => item.score,
    dateGetter: (item) => new Date(item.submission_date),
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
    name: "Proficiency scores: Planning 2.1",
    data: scoresDecreasingDataset,
    valueGetter: (item) => item.score,
    dateGetter: (item) => new Date(item.submission_date),
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
      type: "percentage-difference-of-outlier-group",
      dataset: dataset,
      grouping: grouping,
      writeInsight: ({ groupName, differencePercentage, positive }) => {
        return `[${
          grouping.name
        } ${groupName}] has scored ${differencePercentage.toFixed(2)}% ${
          positive ? "higher" : "lower"
        } than the average of all ${grouping.name.toLowerCase()}s.`;
      },
    });

    // Eg. Group A is a significant outlier compared to the other groups
    registry.register({
      type: "outlier-grouped",
      dataset: dataset,
      grouping: grouping,
    });
  });

  // | -------|
  // | Trends |
  // | -------|

  // Eg. For the past 30 days, the data has been trending upwards
  registry.register({
    type: "linear-regression-recent-trend",
    dataset: dataset,
  });

  // Eg. "There is a clear seasonal pattern, with higher values consistently occurring during the summer months."
  // registry.register({
  //   type: "seasonal-clumping",
  //   dataset: dataset,
  // });

  // Eg. "There is a noticeable change in the data trend starting from date Z."
  // registry.register({
  //   type: 'data-shift',
  //   dataset: dataset,
  // })

  // Eg. "Group A has a significantly higher average score than Group B."
  // registry.register({
  //   type: 'group-comparison-average-value',
  //   dataset: dataset,
  // })

  // Eg. "Over the last year, Group A has consistently outperformed Group B, showing a clear upward trend."
  // registry.register({
  //   type: 'historical-comparison-grouped',
  //   dataset: dataset,
  // })

  // Eg. "Group D is expected to experience a 10% increase in scores over the next quarter based on historical trends."
  // registry.register({
  //   type: 'linear-regression-forecast-for-group',
  //   dataset: dataset,
  // })
});

const insights = registry.generateInsights();
console.log(insights);
