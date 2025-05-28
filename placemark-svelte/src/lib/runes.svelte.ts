import type { Location, Folder } from "$lib/types/location-types";

export const subTitle = $state({ text: "" });
export const loggedInUser = $state({ 
    email: "",
    name: "",
    token: "",
    _id: "",
 });

 export const currentLocations = $state({ locations: [] as Location[] });
 export const currentFolders = $state({ folders: [] as Folder [] });

 export const currentDataSets = $state({
    locationsByCategory: {
        labels: [] as string[],
        datasets: [{ values: [] as number[] }]
    },
    locationsByFolder: {
        labels: [] as string[],
        datasets: [{ values: [] as number[] }]
    },
 });
