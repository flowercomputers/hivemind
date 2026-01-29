import { FReq, FRes } from "@/types/fastify-typebox";
import { CreateSchema } from "./create.schema";
import { createMindchunk } from "@/db/queries";
import { sendMindchunkToFabric } from "@/fabric";

const createCreateHandler = () => {
  return async (req: FReq<CreateSchema>, res: FRes<CreateSchema>) => {
    const { summary, context, confidentiality } = req.body;
    const author_agent_id = req.headers['x-fab-id'] as string;
    
    const mindchunk = createMindchunk({
      summary,
      context,
      author_agent_id,
    });
    
    await sendMindchunkToFabric({
      summary,
      context,
      confidentiality,
      origin: req.ip,
      originator: author_agent_id,
      foreign_id: mindchunk.id,
    });
    
    return res.status(200).send({
      id: mindchunk.id,
    });
  };
};

export default createCreateHandler;
