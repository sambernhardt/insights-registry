import { Insight } from "./types";

export class InsightsRegistry {
  private registry = new Map<string, () => Insight>();

  register(id: string, insightGenerator: () => Insight) {
    if (this.registry.has(id)) {
      return;
    }

    this.registry.set(id, insightGenerator);
  }

  getInsights() {
    return Array.from(this.registry.entries()).map(([id, generator]) => ({
      id,
      insight: generator(),
    }));
  }
}
