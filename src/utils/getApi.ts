import { TApiPointer } from "./types";

import apiUrls from "./apis.json";

export const getApi = (apiName: string) => {
  const apis: TApiPointer = apiUrls["CdkWorkshopStack"];
  const wantedApi = Object.keys(apis).find((endPoint) =>
    endPoint.includes(apiName)
  )!;
  return apis[wantedApi];
};
