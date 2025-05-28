<script lang="ts">
  import { loggedInUser, subTitle } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";
  import type { Location } from "$lib/types/location-types" 
  import Card from "$lib/ui/Card.svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { onMount } from "svelte";

  subTitle.text = "Location Maps";
  let map: LeafletMap;

  onMount(async () => {
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
  });
</script>

<Card title="Location Map">
  <LeafletMap height={60} bind:this={map}/>
</Card>
