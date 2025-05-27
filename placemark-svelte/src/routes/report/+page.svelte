<script lang="ts">
  import { loggedInUser, subTitle } from "$lib/runes.svelte";
  import Card from "$lib/ui/Card.svelte";
  import LocationList from "$lib/ui/LocationList.svelte";
  import { locationService } from "$lib/services/location-service";
  import { onMount } from "svelte";
  import type { Location } from "$lib/types/location-types";

  subTitle.text = "Saved Locations";

  let locations: Location[] = [];
  let loading = true;
  let error = "";


  onMount(async () => {
    if (loggedInUser.token) {
      try {
        const [locationsData, foldersData] = await Promise.all([
          locationService.getLocations(loggedInUser.token),
          locationService.getFolders(loggedInUser.token)
        ]);

        const folderMap = new Map(
            foldersData.map(folder => [folder._id, folder])
        );

        locations = locationsData.map(location => ({
          ...location,
          folder: folderMap.get(location.folderid) ? {
            _id: folderMap.get(location.folderid)!._id,
            title: folderMap.get(location.folderid)!.name || folderMap.get(location.folderid)!.title,
            name: folderMap.get(location.folderid)!.name || folderMap.get(location.folderid)!.title,
          } : null,
          user: {
            _id: loggedInUser._id,
            name: loggedInUser.name,
            email: loggedInUser.email
          }
        }));
      } catch (error) {
        console.error("Error loading locations:", error);
      }
    } else {
      console.warn("No user token available, cannot load locations.");
    }
  });
</script>

<Card title="Saved Locations">
  <LocationList {locations}/>
</Card>
