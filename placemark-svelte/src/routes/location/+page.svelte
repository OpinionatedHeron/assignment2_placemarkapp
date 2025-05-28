<script lang="ts">
  import { loggedInUser, subTitle, currentLocations, currentFolders } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";
  import Card from "$lib/ui/Card.svelte";
  import { onMount } from "svelte";
  import LocationForm from "./LocationForm.svelte";
  import FolderForm from "../folder/FolderForm.svelte";
  import type { Folder, Location } from "$lib/types/location-types";
  import LocationList from "$lib/ui/LocationList.svelte";

  subTitle.text = "Add Locations";
  let folderList: Folder[] = [];
  let locations: Location[] = [];
  let loading = true;
  let error = "";

  onMount(async () => {
    if (!loggedInUser.token) {
        error = "Please log in to view locations.";
        loading = false;
        return;
    }

      try {
        const [foldersData, locationsData] = await Promise.all([
          locationService.getFolders(loggedInUser.token),
          locationService.getLocations(loggedInUser.token)
        ]);

        folderList = foldersData;

        const folderMap = new Map
        (foldersData.map(folder => [folder._id, folder])
    );

    locations = locationsData.map(location => {
        const folder = folderMap.get(location.folderid);
        return {
          ...location,
          folder: folder ? {
            _id: folder._id,
            title: folder.name || folder.title || "Unknown Folder",
            name: folder.name || folder.title || "Unknown Folder"
          } : null,
          user: {
            _id: loggedInUser._id,
            name: loggedInUser.name || "Unknown User",
            email: loggedInUser.email
          }
        };
  });
} catch (e) {
    console.error("Error loading information:", e);
    error = "Failed to load data. Please try again.";
  } 
  loading = false;
  });

  function handleLocationCreated(newLocation) {
    currentLocation.set(newLocation);

    const folder = folderList.find(f => f._id === newLocation.folderid);
    if (folder) currentFolder.set(folder);
  }
</script>

<div class="columns">
  <div class="column>">
    <Card title="Locations Added to Date">
      <LocationList {locations} />
    </Card>
  </div>
  <div class="column">
    <Card title="Please Add Location">
      {#if loading}
        <p>Loading folders...</p>
      {:else if error}
        <p class="error">{error}</p>
      {:else}
        <LocationForm 
        folders={folderList} 
        userToken={loggedInUser.token}
        onLocationCreated={handleLocationCreated} />
      {/if}
    </Card>
  </div>
</div>
