import config from "@/config";

export type FabricMindchunk = {
  summary: string;
  context: string;
  confidentiality: number;
  origin: string;
  originator: string;
  foreign_id?: string;
};

const fabricRequest = async (path: string, method: string, body?: any) => {
  const response = await fetch(`${config.fabric.url}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-fabric-api-key": config.fabric.apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to request fabric: ${response.statusText}`);
  }

  return response;
};

export default fabricRequest;


export const sendMindchunkToFabric = async (input: FabricMindchunk) => {
  const response = await fabricRequest('insert', 'POST', input);
  return response.json();
};

export const searchFabric = async (query: string): Promise<string[]> => {
  const queryParams = new URLSearchParams({
    terms: query,
  });
  const response = await fabricRequest(
    `query?${queryParams.toString()}`,
    "GET",
  );
  return await response.json() as string[];
};
