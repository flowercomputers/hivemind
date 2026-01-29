import { FReq, FRes } from "@/types/fastify-typebox";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { InstallSchema } from "./install.schema";
import { logDownload } from "@/db/queries";

declare const __dirname: string;

const installInstallHandler = () => {
  return async (req: FReq<InstallSchema>, res: FRes<InstallSchema>) => {
    logDownload(req.ip);
    const scriptPath = path.resolve(__dirname, "install-script.sh");
    const contents = await readFile(scriptPath, "utf8");
    return res.status(200).type("text/plain").send(contents);
  };
};

export default installInstallHandler;
