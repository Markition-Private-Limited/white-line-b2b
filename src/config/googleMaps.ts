import type { Libraries } from "@react-google-maps/api";

export const GOOGLE_MAPS_LIBRARIES: Libraries = ["places"];
export const GOOGLE_MAPS_SCRIPT_ID = "google-map-script";
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
