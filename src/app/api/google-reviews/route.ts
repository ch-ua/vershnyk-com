import {NextResponse} from "next/server";

export const revalidate = 3600;

export async function GET(){
 const key=process.env.GOOGLE_PLACES_API_KEY;
 const placeId=process.env.GOOGLE_PLACE_ID;
 if(!key || !placeId) return NextResponse.json({configured:false,reviews:[]},{headers:{"Cache-Control":"public, s-maxage=3600"}});
 try{
  // Legacy Details supports chronological review ordering (newest first).
  const url=new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id",placeId);
  url.searchParams.set("fields","name,rating,user_ratings_total,reviews,url");
  url.searchParams.set("reviews_sort","newest");
  url.searchParams.set("reviews_no_translations","true");
  url.searchParams.set("key",key);
  const response=await fetch(url,{next:{revalidate:3600}});
  if(!response.ok) throw new Error("Google Places request failed");
  const data=await response.json();
  if(data.status!=="OK") throw new Error("Google Places: "+data.status);
  const place=data.result||{};
  return NextResponse.json({configured:true,rating:place.rating,count:place.user_ratings_total,googleUrl:place.url,reviews:(place.reviews||[]).map((r:{author_name?:string,rating?:number,text?:string,time?:number,author_url?:string,profile_photo_url?:string})=>({name:r.author_name||"Google-Nutzer",rating:r.rating||0,text:r.text||"",time:r.time||0,url:r.author_url||"",photo:r.profile_photo_url||""}))},{headers:{"Cache-Control":"public, s-maxage=3600, stale-while-revalidate=86400"}});
 }catch{
  return NextResponse.json({configured:false,reviews:[]},{status:200,headers:{"Cache-Control":"public, s-maxage=300"}});
 }
}
