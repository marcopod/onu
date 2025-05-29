import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Harassment Reporting PWA",
    short_name: "SafeReport",
    description: "A Progressive Web App for reporting and tracking harassment incidents",
    start_url: "/",
    display: "standalone",
    background_color: "#f9d5d5",
    theme_color: "#2d6a4f",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
