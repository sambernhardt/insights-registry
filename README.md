```sh
bun --watch index.ts

Created 10 insights for 2 datasets with 20 rows of data.
[
  {
    dataset: "Proficiency scores: Planning 1.1",
    grouping: "School",
    type: "percentage-difference-of-outlier-group",
    insight: "[School Eastside High School] has scored 62.50% lower than the average of all schools."
  },
  {
    dataset: "Proficiency scores: Planning 1.1",
    grouping: "School",
    type: "outlier-grouped",
    insight: "[Eastside High School] is a significant negative outlier compared to the other groups."
  },
  {
    dataset: "Proficiency scores: Planning 1.1",
    grouping: "Student",
    type: "percentage-difference-of-outlier-group",
    insight: "[Student Robert] has scored 66.67% lower than the average of all students."
  },
  {
    dataset: "Proficiency scores: Planning 1.1",
    grouping: "Student",
    type: "outlier-grouped",
    insight: "[Robert] is a significant negative outlier compared to the other groups."
  },
  ...
]
```
