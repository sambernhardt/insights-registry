import { Dataset, Insight, InsightGeneratorDefinition } from "./types";

export class InsightsRegistry {
  private registry = new Map<string, InsightGeneratorDefinition>();
  private datasets = new Map<number, Dataset>();

  register(insightGenerator: InsightGeneratorDefinition) {
    const id = `${insightGenerator.type}-${insightGenerator.dataset.name}-${insightGenerator.id}`;

    if (this.registry.has(id)) {
      return;
    }

    if (!this.datasets.has(insightGenerator.id)) {
      this.datasets.set(insightGenerator.id, insightGenerator.dataset);
    }

    this.registry.set(id, insightGenerator);
  }

  generateInsights() {
    const datasets = Array.from(this.datasets.values());
    const totalRows = datasets.reduce(
      (acc, dataset) => acc + dataset.data.length,
      0
    );

    const insights = Array.from(this.registry.entries()).map(
      ([id, definition]) => ({
        // dataset: definition.dataset.name,
        type: definition.type,
        insight: definition.generator(),
      })
    );

    console.log(
      `Created ${insights.length.toLocaleString()} insights for ${datasets.length.toLocaleString()} datasets with ${totalRows.toLocaleString()} rows of data.`
    );

    return insights;
  }
}
