import { ImageResponse } from "next/og";

export const alt = "Dropoff TV show";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getShow(id: string) {
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await getShow(id);
  const name: string = show?.name ?? "TV Bland";
  const rating: number | null = show?.rating?.average ?? null;
  const poster: string | null = show?.image?.original ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {poster ? (
          <img
            src={poster}
            width={420}
            height={630}
            style={{ objectFit: "cover" }}
            alt=""
          />
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: 56,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {rating ? (
              <div style={{ display: "flex", fontSize: 34, color: "#fbbf24" }}>
                {`${rating.toFixed(1)} / 10`}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {name}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 30, opacity: 0.7 }}>
            Dropoff TV
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
