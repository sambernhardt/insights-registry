import { InsightAlgorithmWithGroup } from "../../types";

const defaultWriteInsight = ({ groupName, positive }) =>
  `[${groupName}] is a significant ${
    positive ? "positive" : "negative"
  } outlier compared to the other groups.`;

const zScoreSignificantOutlierGroup: InsightAlgorithmWithGroup = (
  data,
  valueGetter,
  groupGetter,
  writeInsight = defaultWriteInsight
) => {
  if (!groupGetter(data[0])) {
    throw new Error(`Could not find group in data`);
  }

  // Calculate the mean and standard deviation for the global dataset
  const values = data.map(valueGetter);
  const meanValue =
    values.reduce((sum, score) => sum + score, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce(
      (variance, score) => variance + Math.pow(score - meanValue, 2),
      0
    ) / values.length
  );

  const groupValues = new Map();

  // Iterate through data to group values by group
  data.forEach((submission) => {
    const group = groupGetter(submission);
    const value = valueGetter(submission);

    if (!groupValues.has(group)) {
      groupValues.set(group, []);
    }

    groupValues.get(group).push(value);
  });

  // Calculate the z-score for each group
  const groupZScores = new Map();
  for (const [group, values] of groupValues) {
    const zScores = values.map((value) => (value - meanValue) / stdDev);
    groupZScores.set(
      group,
      zScores.reduce((sum, zScore) => sum + zScore, 0) / zScores.length
    );
  }

  // Find the group with the highest positive z-score (outlier) or lowest negative z-score
  let significantOutlierGroup = null;
  let significantOutlierZScore = 0;

  for (const [group, zScore] of groupZScores) {
    if (Math.abs(zScore) > Math.abs(significantOutlierZScore)) {
      significantOutlierGroup = group;
      significantOutlierZScore = zScore;
    }
  }

  // Create the insight if a significant outlier group is found
  if (significantOutlierGroup) {
    return writeInsight({
      groupName: significantOutlierGroup,
      positive: significantOutlierZScore > 0,
    });
  }

  return null;
};

export default zScoreSignificantOutlierGroup;
