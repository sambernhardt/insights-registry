/**
 * Finds the group with the highest absolute value of average value and returns the
 * percentage difference from the average of all groups.
 *
 * Eg. "Group A scored 10% better than the average of all other groups."
 */

import { InsightAlgorithmWithGroup } from "../../types";

const defaultWriteInsight = ({ groupName, positive, differencePercentage }) =>
  `${groupName} is ${differencePercentage.toFixed(2)}% ${
    positive ? "higher" : "lower"
  } than the average of all groups.`;

export const outlierGroupPercentageDifferenceOfSum: InsightAlgorithmWithGroup =
  (data, valueGetter, groupGetter, writeInsight = defaultWriteInsight) => {
    if (!groupGetter(data[0])) {
      throw new Error(`Could not find group in data`);
    }

    const valuesByGroup: Record<string, number[]> = data.reduce(
      (acc, datapoint) => {
        const result = { ...acc };

        const groupName = groupGetter(datapoint);
        const value = valueGetter(datapoint);

        if (!result[groupName]) {
          result[groupName] = [];
        }

        result[groupName].push(value);

        return result;
      },
      {} as Record<string, number[]>
    );

    const sumValuesByGroup = Object.entries(valuesByGroup).reduce(
      (acc, [group, values]) => {
        const result = { ...acc };

        const sumValue = values.reduce((acc, value) => {
          return acc + value;
        }, 0);

        result[group] = sumValue;

        return result;
      },
      {} as Record<string, number>
    );

    // console.log(sumValuesByGroup);

    const averageSumAllGroups = Object.entries(sumValuesByGroup).reduce(
      (sum, [, value]) => sum + value,
      0
    );

    const percentageOfTotalByGroup = Object.entries(sumValuesByGroup).reduce(
      (acc, [group, value]) => {
        const result = { ...acc };

        result[group] = value / averageSumAllGroups;

        return result;
      },
      {} as Record<string, number>
    );

    // console.log(percentageOfTotalByGroup);

    // console.log(distanceFromAverageByGroup);

    // Return group [name, value] with the highest absolute value of value
    const groupOfInterest = Object.entries(distanceFromAverageByGroup).reduce(
      (acc, [group, value]) => {
        if (acc[1] === null || Math.abs(value) > Math.abs(acc[1])) {
          return [group, value];
        }

        return acc;
      },
      [null, null] as [string | null, number | null]
    );
    const [groupOfInterestName] = groupOfInterest;

    // const groupAverage = averageValueByGroup[groupOfInterestName];
    // const difference = groupAverage - averageValueAllGroups;
    // const positive = difference >= 0;
    // let differencePercentage = (difference / averageValueAllGroups) * 100;
    // differencePercentage = positive
    //   ? differencePercentage
    //   : -differencePercentage;

    return writeInsight({
      groupName: "groupOfInterestName",
      difference: 5,
      differencePercentage: 5,
      positive: true,
    });
  };
