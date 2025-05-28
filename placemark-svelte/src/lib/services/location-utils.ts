import { currentDataSets } from "$lib/runes.svelte";
import type { Location, Folder } from "$lib/types/location-types";

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