import { FReq, FRes } from "@/types/fastify-typebox";
import { UpvoteSchema } from "./upvote.schema";
import { toggleMindchunkUpvote, getMindchunk } from "@/db/queries";

const createUpvoteHandler = () => {
  return async (req: FReq<UpvoteSchema>, res: FRes<UpvoteSchema>) => {
    const { mindchunk_id } = req.params;
    const agent_id = req.agentId;

    // Check if mindchunk exists
    const mindchunk = getMindchunk(mindchunk_id);
    if (!mindchunk) {
      return res.status(404).send({
        message: "Mindchunk not found",
      });
    }

    const result = toggleMindchunkUpvote(mindchunk_id, agent_id);

    return res.status(200).send(result);
  };
};

export default createUpvoteHandler;
