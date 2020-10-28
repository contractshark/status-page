import * as sapper from "@sapper/server";
import compression from "compression";
import fs from "fs-extra";
import polka from "polka";
import sirv from "sirv";
import { safeLoad } from "js-yaml";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

let config = safeLoad(fs.readFileSync(join(".", ".upptimerc.yml"), "utf8"));
try {
  const file = fs.readFileSync(join("..", "..", ".upptimerc.yml"), "utf8");
  if (file) {
    config = safeLoad(file);
    console.log("Using root config instead", config);
  }
} catch (error) {
  console.log("Root config not found 2 dirs up");
}
const baseUrl = (config["status-website"] || {}).baseUrl || "/";

polka()
  .use(baseUrl, compression({ threshold: 0 }), sirv("static", { dev }), sapper.middleware())
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
