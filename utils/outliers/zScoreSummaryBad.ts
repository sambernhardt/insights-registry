export function zScoreSummaryBad(data: any[], groupKey: string) {
  if (!data[0][groupKey]) {
    throw new Error(`Could not find group ${groupKey} in data`);
  }

  // Calculate the z-scores for all data points
  const scores = data.map(({ score }) => score);
  const meanScore =
    scores.reduce((acc, score) => acc + score, 0) / scores.length;
  const stdDev = Math.sqrt(
    scores.reduce((acc, score) => acc + Math.pow(score - meanScore, 2), 0) /
      scores.length
  );
  const zScoresData: any[] = data.map((submission) => ({
    ...submission,
    zScore: (submission.score - meanScore) / stdDev,
  }));

  const submissionsPerGroup = zScoresData.reduce((acc, submission) => {
    const groupName = submission[groupKey];

    return {
      ...acc,
      [groupName]: (acc[groupName] || 0) + 1,
    };
  }, {} as Record<string, number>);

  const totalZScorePerGroup: {
    [key: string]: number;
  }[] = zScoresData.reduce((acc, { zScore, ...submission }) => {
    const groupName = submission[groupKey];

    return {
      ...acc,
      [groupName]: (acc[groupName] || 0) + zScore,
    };
  }, {} as Record<string, number>);

  const averageZScorePerGroup = Object.keys(submissionsPerGroup).reduce(
    (acc, groupName) => ({
      ...acc,
      [groupName]:
        totalZScorePerGroup[groupName] / submissionsPerGroup[groupName],
    }),
    {} as Record<string, number>
  );

  const groupOfInterest = Object.keys(averageZScorePerGroup).reduce(
    (acc, groupName) =>
      Math.abs(averageZScorePerGroup[acc]) >
      Math.abs(averageZScorePerGroup[groupName])
        ? acc
        : groupName
  );

  // Sort the scores for the distribution
  const sortedScores = Object.values(data).sort((a, b) => a - b);

  // Calculate the exact distribution (CDF)
  const n = sortedScores.length;
  const cdf = Array(n)
    .fill(0)
    .map((_, i) => (i + 1) / n);

  // Find the index where the group of interest's score fits in the CDF
  let index = 0;
  while (index < n && sortedScores[index] < data[groupOfInterest]) {
    index++;
  }

  // Calculate the percentage
  let percentage;
  if (index < n) {
    percentage = cdf[index] * 100;
  }

  return index < n
    ? `${groupOfInterest} scored better than ${percentage.toFixed(
        2
      )}% of all groups.`
    : `${groupOfInterest}'s score is higher than all groups in the dataset.`;
}
