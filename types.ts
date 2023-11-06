type valueGetter = (item: any) => number;
type groupGetter = (item: any) => string;

export type Insight = string | null;

export type InsightAlgorithm = (data: any, valueGetter: valueGetter) => Insight;

export type InsightGeneratorDefinition = {
  id: number;
  name: string;
  type: string;
  dataset: Dataset;
  generator: () => Insight;
};

export type InsightAlgorithmWithGroup = (
  data: any,
  valueGetter: valueGetter,
  groupGetter: groupGetter,
  writeInsight?: (params: any) => Insight
) => Insight;

export type InsightGenerator = {
  id: string;
  algorithm: () => Insight;
};

export type Dataset = {
  name: string;
  data: any[];
  valueGetter: valueGetter;
  groupings: {
    name: string;
    getter: groupGetter;
  }[];
};
