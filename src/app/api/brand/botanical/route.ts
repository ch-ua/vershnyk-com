export const dynamic = "force-static";

const botanical=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 360"><g fill="none" stroke="#073e31" stroke-width="3"><path d="M52 350C72 270 91 190 128 74M87 258c-40-24-55-58-58-91M100 216c42-18 66-48 77-89M116 157c-28-18-40-43-43-72M131 105c29-11 47-31 57-58"/><path d="M29 167c24 5 43 19 58 42M73 85c23 7 38 23 46 47M177 127c-21 6-38 19-51 39M188 47c-19 7-34 20-44 39"/></g></svg>`;

export async function GET(){
  return new Response(botanical,{
    headers:{
      "Content-Type":"image/svg+xml; charset=utf-8",
      "Cache-Control":"public, max-age=31536000, immutable"
    }
  });
}
