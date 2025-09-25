import OpenAI from "openai";
import { OPEN_API_KEY } from "./environmentVariables";

const openai = new OpenAI({
  apiKey: OPEN_API_KEY,
});


export default openai;