import { getCSVContents } from "./utils/utils";

export const scoresDecreasing: {
  submission_date: string;
  first_name: string;
  last_name: string;
  school: string;
  score: number;
}[] = await getCSVContents(`
submission_date,first_name,last_name,school,score
2023-10-27,Robert,Thomas,Westside High School,5
2023-10-28,Lisa,Martin,Southside High School,4
2023-10-29,Michael,Anderson,Eastside High School,3
2023-10-30,Sarah,Davis,North High School,2
2023-10-31,David,Williams,West High School,1
2023-11-01,Emily,Johnson,South High School,5
2023-11-02,John,Smith,East High School,4
2023-11-03,Nelie,Beston,Westside High School,3
2023-11-04,Tera,Breede,Westside High School,2
2023-11-05,Cale,Ferdinand,North High School,1
`);

export const scoresIncreasing: {
  submission_date: string;
  first_name: string;
  last_name: string;
  school: string;
  score: number;
}[] = await getCSVContents(`
submission_date,first_name,last_name,school,score
2023-10-27,Robert,Thomas,Westside High School,1
2023-10-28,Lisa,Martin,Southside High School,2
2023-10-29,Michael,Anderson,Eastside High School,1
2023-10-30,Sarah,Davis,North High School,3
2023-10-31,David,Williams,West High School,1
2023-11-01,Emily,Johnson,South High School,3
2023-11-02,John,Smith,East High School,4
2023-11-03,Nelie,Beston,Westside High School,5
2023-11-04,Tera,Breede,Westside High School,5
2023-11-05,Cale,Ferdinand,North High School,5
`);
