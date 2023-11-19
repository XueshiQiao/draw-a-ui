const systemPrompt_Orig = `You are an expert tailwind developer. A user will provide you with a
 low-fidelity wireframe of an application and you will return
 a single html file that uses tailwind to create the website. Use creative license to make the application more fleshed out.
if you need to insert an image, use placehold.co to create a placeholder image. Respond only with the html file.`;

const systemPrompt = `You are an expert vue developer and familiar with Ant Design Vue framework. A user will provide you with a
 low-fidelity wireframe of an application and you will return
 a single html file that uses Ant Design Vue to create the website. Use creative license to make the application more fleshed out.
if you need to insert an image, use placehold.co to create a placeholder image. Respond only with the html file.`;

export async function POST(request: Request) {
  const { image } = await request.json();
  const body: GPT4VCompletionRequest = {
    model: "gpt-4-vision-preview",
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: image,
          },
          "Turn this into a single html file using Ant Design Vue.",
        ],
      },
    ],
  };

  let json = null;
  try {
    const endpoint_openrouter = "https://openrouter.ai/api/v1/chat/completions"
    const endpoint_openai = "https://api.openai.com/v1/chat/completions"
    const YOUR_SITE_URL = "http://draw-a-ui.xueshi.io"
    const YOUR_SITE_NAME = "xueshi's draw-a-ui"
    console.log("requesting", endpoint_openrouter);
    console.log("body", JSON.stringify(body))

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "HTTP-Referer": `${YOUR_SITE_URL}`, // To identify your app. Can be set to e.g. http://localhost:3000 for testing
      "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows on openrouter.ai
    };

    console.log("body", JSON.stringify(headers))

    const resp = await fetch(endpoint_openrouter, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "HTTP-Referer": `${YOUR_SITE_URL}`, // To identify your app. Can be set to e.g. http://localhost:3000 for testing
        "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows on openrouter.ai
      },
      body: JSON.stringify(body),
    });
    json = await resp.json();
  } catch (e) {
    console.log(e);
  }

  return new Response(JSON.stringify(json), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
}

type MessageContent =
  | string
  | (string | { type: "image_url"; image_url: string })[];

export type GPT4VCompletionRequest = {
  model: "gpt-4-vision-preview";
  messages: {
    role: "system" | "user" | "assistant" | "function";
    content: MessageContent;
    name?: string | undefined;
  }[];
  functions?: any[] | undefined;
  function_call?: any | undefined;
  stream?: boolean | undefined;
  temperature?: number | undefined;
  top_p?: number | undefined;
  max_tokens?: number | undefined;
  n?: number | undefined;
  best_of?: number | undefined;
  frequency_penalty?: number | undefined;
  presence_penalty?: number | undefined;
  logit_bias?:
    | {
        [x: string]: number;
      }
    | undefined;
  stop?: (string[] | string) | undefined;
};
