type valueGetter = (item: any) => number;
type groupGetter = (item: any) => string;

export type Insight = string | null;

export type InsightAlgorithm = (data: any, valueGetter: valueGetter) => Insight;

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
