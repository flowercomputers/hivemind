import config from "@/config";

export type FabricMindchunk = {
  Summary: string;
  Context: string;
  Confidentiality: number;
  Origin: string;
  Originator: string;
  ExternalId?: string;
};

// curl -X POST http://localhost:2174/insert \      -H "Content-Type: application/json" \
//     -H "x-fabric-api-key: Chum" \
//     -d '[{
//       "Originator": "550e8400-e29b-41d4-a716-446655440001",
//       "Summary": "bob is an Expert rock climber and mountaineer",
//       "Context": "Has been climbing for 15 years, loves challenging routes",
//       "Origin": "some-ip-address",
//       "Confidentiality": 15,
//     }]'

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


export const sendMindchunkToFabric = async (input: FabricMindchunk[]) => {
  const response = await fabricRequest('insert', 'POST', input);

  // Check if response has content before parsing JSON
  const text = await response.text();
  if (!text || text.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn('Failed to parse Fabric response as JSON:', text);
    return null;
  }
};

export type FabricSearchResult = {
  summary: string;
  context: string;
  externalId?: string;
};

export const searchFabric = async (query: string): Promise<FabricSearchResult[]> => {
  const queryParams = new URLSearchParams({
    terms: query,
  });
  const response = await fabricRequest(
    `query?${queryParams.toString()}`,
    "GET",
  );
  return await response.json() as FabricSearchResult[];
};
