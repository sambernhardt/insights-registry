import { Dataset, Insight, InsightGeneratorDefinition } from "./types";
import {
  outlierGroupPercentageDifferenceOfAverage,
  zScoreSignificantOutlierGroup,
} from "./utils/outliers";
import { linearRegressionForecast } from "./utils/trends";

const generatorLookup = {
  "percentage-difference-of-outlier-group": {
    generator: outlierGroupPercentageDifferenceOfAverage,
  },
  "outlier-grouped": {
    generator: zScoreSignificantOutlierGroup,
  },
  "linear-regression-recent-trend": {
    generator: linearRegressionForecast,
  },
};

let i = 0;

export class InsightsRegistry {
  private registry = new Map<string, InsightGeneratorDefinition>();
  private datasets = new Map<string, Dataset>();

  register(insightGenerator: InsightGeneratorDefinition) {
    const id = `${insightGenerator.type}-${insightGenerator.dataset.name}-${i}`;

    if (this.registry.has(id)) {
      return;
    }

    if (!this.datasets.has(insightGenerator.dataset.name)) {
      this.datasets.set(
        insightGenerator.dataset.name,
        insightGenerator.dataset
      );
    }

    this.registry.set(id, insightGenerator);
    i++;
  }

  generateInsights() {
    const datasets = Array.from(this.datasets.values());
    const totalRows = datasets.reduce(
      (acc, dataset) => acc + dataset.data.length,
      0
    );

    const insights = Array.from(this.registry.entries()).map(
      ([id, definition]) => {
        const generator = generatorLookup[definition.type].generator;

        return {
          dataset: definition.dataset.name,
          ...(definition.grouping
            ? { grouping: definition.grouping.name }
            : {}),
          type: definition.type,
          insight: generator({
            dataset: definition.dataset,
            grouping: definition.grouping,
            writeInsight: definition.writeInsight,
          }),
        };
      }
    );

    console.log(
      `Created ${insights.length.toLocaleString()} insights for ${datasets.length.toLocaleString()} datasets with ${totalRows.toLocaleString()} rows of data.`
    );

    return insights;
  }
}
