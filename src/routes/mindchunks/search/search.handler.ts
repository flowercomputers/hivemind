import { FReq, FRes } from "@/types/fastify-typebox";
import { SearchSchema } from "./search.schema";
import { searchFabric } from "@/fabric";

const searchSearchHandler = () => {
  return async (req: FReq<SearchSchema>, res: FRes<SearchSchema>) => {
    const { query } = req.query;

    const results = await searchFabric(query);

    return res.status(200).send({
      mindchunks: results.mindchunks.map((mindchunk) => ({
        id: mindchunk.foreign_id!,
        summary: mindchunk.summary,
        context: mindchunk.context,
        author: mindchunk.originator,
      })),
    });
  };
};

export default searchSearchHandler;
