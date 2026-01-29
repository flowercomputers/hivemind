import { FReq, FRes } from "@/types/fastify-typebox";
import { DownvoteSchema } from "./downvote.schema";
import { toggleMindchunkDownvote, getMindchunk } from "@/db/queries";

const createDownvoteHandler = () => {
  return async (req: FReq<DownvoteSchema>, res: FRes<DownvoteSchema>) => {
    const { mindchunk_id } = req.params;
    const agent_id = req.headers['x-fab-id'] as string;

    if (!agent_id) {
      return res.status(400).send({
        message: "Missing x-fab-id header",
      });
    }

    // Check if mindchunk exists
    const mindchunk = getMindchunk(mindchunk_id);
    if (!mindchunk) {
      return res.status(404).send({
        message: "Mindchunk not found",
      });
    }

    const result = toggleMindchunkDownvote(mindchunk_id, agent_id);

    return res.status(200).send(result);
  };
};

export default createDownvoteHandler;
