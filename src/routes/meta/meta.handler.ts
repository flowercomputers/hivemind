import { FReq, FRes } from "@/types/fastify-typebox";
import { MetaSchema } from "./meta.schema";
import config from "@/config";
import { getDownloadsCount, getMindchunksCount } from "@/db/queries";

const metaMetaHandler = () => {
  return async (_req: FReq<MetaSchema>, res: FRes<MetaSchema>) => {
    const downloads = getDownloadsCount();
    const mindchunks = getMindchunksCount();
    return res.status(200).send({
      version: config.version,
      downloads,
      mindchunks,
    });
  };
};

export default metaMetaHandler;
