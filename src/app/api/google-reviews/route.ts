import {NextResponse} from "next/server";

export const revalidate = 900;

type NewReview = {
  rating?: number;
  text?: {text?: string};
  originalText?: {text?: string};
  publishTime?: string;
  authorAttribution?: {displayName?: string; uri?: string; photoUri?: string};
};

/** Places API (New): GET /v1/places/{id}. Returns max. 5 reviews (Google limit). */
export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  const short = {"Cache-Control": "public, s-maxage=300"};
  if (!key || !placeId) {
    return NextResponse.json({configured: false, code: !key ? "PLACES_KEY_MISSING" : "PLACE_ID_MISSING", reviews: []}, {headers: short});
  }
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=de`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,googleMapsUri,reviews"
      },
      next: {revalidate: 900}
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(`PLACES_${body?.error?.status || "HTTP_" + response.status}: ${body?.error?.message || ""}`);
    }
    const place = await response.json();
    const reviews = ((place.reviews || []) as NewReview[])
      .map(r => ({
        name: r.authorAttribution?.displayName || "Google-Nutzer",
        rating: r.rating || 0,
        text: r.originalText?.text || r.text?.text || "",
        time: r.publishTime ? Math.floor(new Date(r.publishTime).getTime() / 1000) : 0,
        url: r.authorAttribution?.uri || "",
        photo: r.authorAttribution?.photoUri || ""
      }))
      .sort((a, b) => b.time - a.time);
    return NextResponse.json(
      {configured: true, rating: place.rating, count: place.userRatingCount, googleUrl: place.googleMapsUri, reviews},
      {headers: {"Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600"}}
    );
  } catch (error) {
    console.error("Google reviews failed", error);
    return NextResponse.json({configured: false, code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN", reviews: []}, {headers: short});
  }
}
