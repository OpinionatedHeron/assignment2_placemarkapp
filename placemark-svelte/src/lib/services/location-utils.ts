import { currentDataSets, loggedInUser } from "$lib/runes.svelte";
import type { Location, Folder } from "$lib/types/location-types";
import type LeafletMap from "$lib/ui/LeafletMap.svelte";
import { locationService } from "$lib/services/location-service"

export function computeByCategory(locations: Location[]) {
    const categoryCounts: Record<string, number> = {};
    locations.forEach((loc) => {
        if (loc.category) {
            categoryCounts[loc.category] = (categoryCounts[loc.category] || 0) +1;
        }
    });
    currentDataSets.locationsByCategory.labels = Object.keys(categoryCounts);
    currentDataSets.locationsByCategory.datasets[0].values = Object.values(categoryCounts);
}

export function computeByFolder(locations: Location[], folders: Folder[]) {
    const folderMap: Record<string, string> = {};
    folders.forEach(folder => {
        folderMap[folder._id] = folder.name || folder.title || "Unknown";
    });

    const folderCounts: Record<string, number> = {};
    locations.forEach((loc) => {
        const folderName = loc.folderid ? (folderMap[loc.folderid] || "Unknown") : "Unkown";
        folderCounts[folderName] = (folderCounts[folderName] || 0) + 1;
    });

    currentDataSets.locationsByFolder.labels = Object.keys(folderCounts);
    currentDataSets.locationsByFolder.datasets[0].values = Object.values(folderCounts);
}

export async function refreshLocationMap (map:LeafletMap){
    await locationService.restoreSession();
    const locations = await locationService.getLocations(loggedInUser.token);
    locations.forEach((location: Location) => {
        if (location.latitude && location.longitude){
            const popup = `
            <strong>${location.title}</strong><br>
            Category: ${location.category || "N/A"}<br>
            Folder: ${location.folder?.name || location.folder?.title || "N/A"}<br>
            ${location.description ? `Notes: ${location.description}` : ""}
            `;
            map.addMarker(location.latitude, location.longitude, location.title);
        }
    });
    const lastLocation = locations[locations.length -1];
    if (lastLocation) map.moveTo(lastLocation.latitude, lastLocation.longitude);
}