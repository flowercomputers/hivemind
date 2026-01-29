import { FReq, FRes } from "@/types/fastify-typebox";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { InstallSchema } from "./install.schema";

declare const __dirname: string;

const installInstallHandler = () => {
  return async (_req: FReq<InstallSchema>, res: FRes<InstallSchema>) => {
    const scriptPath = resolve(__dirname, "install-script.sh");
    const contents = await readFile(scriptPath, "utf8");
    return res.status(200).type("text/plain").send(contents);
  };
};

export default installInstallHandler;
