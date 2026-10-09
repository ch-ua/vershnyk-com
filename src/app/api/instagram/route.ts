import {NextResponse} from "next/server";

export const revalidate=1800;

export async function GET(){
  const token=process.env.INSTAGRAM_ACCESS_TOKEN;
  if(!token) return NextResponse.json({configured:false,items:[]});

  const fields="id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url="https://graph.instagram.com/me/media?fields="+encodeURIComponent(fields)+"&limit=6&access_token="+encodeURIComponent(token);

  try{
    const res=await fetch(url,{next:{revalidate:1800}});
    if(!res.ok) return NextResponse.json({configured:true,items:[]},{status:200});
    const data=await res.json();
    return NextResponse.json({configured:true,items:Array.isArray(data.data)?data.data:[]});
  }catch{
    return NextResponse.json({configured:true,items:[]},{status:200});
  }
}