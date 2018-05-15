export interface Hotel {
    name: string;
    lat: number;
    lng: number;
    tags: string[];
    desc?: string;
    marker?: google.maps.Marker;
    price?: number;
    rate?: number;
};