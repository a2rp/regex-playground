import { matchTextWithRegex } from "../utils/matchTextWithRegex.js";

self.onmessage = (event) => self.postMessage(matchTextWithRegex(event.data));
