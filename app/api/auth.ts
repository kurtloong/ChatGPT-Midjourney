import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";
import md5 from "spark-md5";
import { ACCESS_CODE_PREFIX } from "../constant";
import { OPENAI_URL } from "./common";



export function auth(req: NextRequest,skipCustomKey=true) {

  return {
    error: false,
  };
}
