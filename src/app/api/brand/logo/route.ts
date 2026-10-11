import {logo} from "@/data/logo";

export const dynamic = "force-static";

export async function GET(){
  const base64=logo.split(",")[1] ?? "";
  const body=Buffer.from(base64,"base64");
  return new Response(body,{
    headers:{
      "Content-Type":"image/webp",
      "Cache-Control":"public, max-age=31536000, immutable"
    }
  });
}
