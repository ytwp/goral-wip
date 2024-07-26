import { State } from "@/constant";
import { DateResponse, QueryResponse } from "../../types/execute-sql";
import { api } from "../base";

export default async function executeSql(sql: string): Promise<any> {
  const warnings: any = []
  let data: any[][] = []

  const uri = "/v1/statement";
  let response: QueryResponse = await api.postRaw(uri, sql) as QueryResponse
  while (response.nextUri) {
    const nextUri = response.nextUri
    const parsedNextUri = new URL(nextUri);
    if (response.stats.state === State.QUEUED) {
      response = await api.get(parsedNextUri.pathname) as QueryResponse
    } else if (response.stats.state === State.RUNNING || response.stats.state === State.FINISHED) {
      if (response.data) {
        data = data.concat(response.data)
      }
      response = await api.get(parsedNextUri.pathname) as QueryResponse
    }
  }
  if (response.stats.state === State.FINISHED) {
    if (response.data) {
      data = data.concat(response.data)
    }
  } else {
    // default FAILED
    const dateResponse: DateResponse = {
      id: response.id,
      infoUri: response.infoUri,
      warnings: warnings,
      error: response.error,
      state: State.FAILED
    }
    return dateResponse
  }
  const dateResponse: DateResponse = {
    id: response.id,
    infoUri: response.infoUri,
    warnings: warnings,
    columns: response.columns,
    data: data,
    state: State.FINISHED
  }
  return dateResponse
}
