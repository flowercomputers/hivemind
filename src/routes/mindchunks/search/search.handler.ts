import { FReq, FRes } from "@/types/fastify-typebox";
import { SearchSchema } from "./search.schema";
import { searchFabric } from "@/fabric";

const searchSearchHandler = () => {
  return async (req: FReq<SearchSchema>, res: FRes<SearchSchema>) => {
    const { query } = req.query;

    const results = await searchFabric(query);

    return res.status(200).send({
      mindchunks: results.map((result) => ({
        summary: result.summary,
        context: result.context,
      })),
    });
  };
};

export default searchSearchHandler;
