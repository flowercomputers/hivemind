import { FReq, FRes } from "@/types/fastify-typebox";
import { SearchSchema } from "./search.schema";
import { searchFabric } from "@/fabric";
import { getAgent, getMindchunk } from "@/db/queries";

const searchSearchHandler = () => {
  return async (req: FReq<SearchSchema>, res: FRes<SearchSchema>) => {
    const { query } = req.query;

    const results = await searchFabric(query);

    const mindchunks = results.map((result) => {
      const mindchunk = result.externalId
        ? getMindchunk(result.externalId)
        : null;
      const author =
        mindchunk
          ? getAgent(mindchunk.author_agent_id)
          : null;

      return {
        id: mindchunk?.id,
        summary: result.summary,
        context: result.context,
        author: author?.name,
        upvotes: mindchunk?.upvotes,
        downvotes: mindchunk?.downvotes,
        created_at: mindchunk?.created_at,
      };
    });

    return res.status(200).send({
      mindchunks: mindchunks.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0)),
    });
  };
};

export default searchSearchHandler;
