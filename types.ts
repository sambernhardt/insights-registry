type valueGetter = (item: any) => number;
type groupGetter = (item: any) => string;
type dateGetter = (item: any) => Date;

export type Insight = string | null;

export type InsightAlgorithm = (data: any, valueGetter: valueGetter) => Insight;

export type InsightGeneratorDefinition = {
  type: string;
  dataset: Dataset;
  grouping?: Grouping;
  writeInsight?: (params: any) => Insight;
};

export type Grouping = {
  name: string;
  getter: groupGetter;
};

export type InsightAlgorithmWithGroup = (args: {
  dataset: Dataset;
  grouping?: Grouping;
  writeInsight?: (params: any) => Insight;
}) => Insight;

export type InsightGenerator = {
  id: string;
  algorithm: () => Insight;
};

export type Dataset = {
  name: string;
  data: any[];
  valueGetter: valueGetter;
  dateGetter: dateGetter;
  groupings: Grouping[];
};
