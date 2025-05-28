<script lang="ts">
  import { loggedInUser, subTitle } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";
  import type { Location } from "$lib/types/location-types";
  import Card from "$lib/ui/Card.svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { onMount } from "svelte";
  import { refreshLocationMap } from "$lib/services/location-utils";

  subTitle.text = "Location Maps";

  let map: LeafletMap;
  let locations: Location[] = [];
  let folderList = [];
  let categoryLayers = {};
  let folderLayers = {};

  let loading = true;

  onMount(async () => {
    if (!loggedInUser.token) {
      loading = false;
      return;
    }

    try {
      const [foldersData, locationsData] = await Promise.all([
        locationService.getFolders(loggedInUser.token),
        locationService.getLocations(loggedInUser.token)
      ]);
      folderList = foldersData;
      locations = locationsData;

      const byCategory = groupBy(locations, "category");
      categoryLayers = {};
      for (const [cat, locs] of Object.entries(byCategory)) {
        categoryLayers[cat] = locs.map((loc) => ({
          lat: loc.latitude,
          lng: loc.longitude,
          title: loc.title,
          popup: `<strong>${loc.title}</strong><br>Category: ${cat}`
        }));
      }
      const byFolder = groupBy(locations, "folderid");
      folderLayers = {};
      for (const [fid, locs] of Object.entries(byFolder)) {
        const folderName = folderList.find((f) => f._id == fid)?.name || "Unkown Folder";
        folderLayers[folderName] = locs.map((loc) => ({
          lat: loc.latitude,
          lng: loc.longitude,
          title: loc.title,
          popup: `<strong>${loc.title}</strong><br>Folder: ${folderName}`
        }));
      }
    } catch (error) {
      console.error("Error loading map data:", error);
    } finally {
      loading = false;
    }
  });

  $: if (map && !loading) {
    refreshLocationMap(map);
  }

  function groupBy(arr: Location[], key: string) {
    return arr.reduce((acc, item) => {
      const group =(item as any)[key] || "Unknown";
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {} as Record<string, Location[]>);
  }
</script>
{#if loading}
<div class="notification is-info">Loading maps...</div>
{:else if !loggedInUser.token}
<div class="notification is-warning"> Please log in to view maps</div>
{:else}

<Card title="Locations Map">
  <LeafletMap height={60} bind:this={map} />
</Card>

<div class="columns">
  <div class="column">
    <Card title="Location Categories Map">
      <LeafletMap height={60} mapType="category" {categoryLayers} />
    </Card>
  </div>

  <div class="column">
    <Card title="Folders Map">
      <LeafletMap height={60} mapType="folder" {folderLayers} />
    </Card>
  </div>
</div>
{/if}
