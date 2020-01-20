import axios from "axios";

export interface ApiResult {
  success: boolean;
  data: any;
}

let baseUrl = process.env.SERVERSIDEURL || "http://localhost:3000";

async function getAssetsUrlByCode(code: string): Promise<ApiResult> {
  let result = await axios.get(baseUrl + "/code/" + code);
  return result.data;
}

export { getAssetsUrlByCode };
