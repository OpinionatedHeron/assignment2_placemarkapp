<script lang="ts">
  import { loggedInUser, subTitle } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";
  import Card from "$lib/ui/Card.svelte";
  import { onMount } from "svelte";
  import LocationForm from "./LocationForm.svelte";
  import FolderForm from "../folder/FolderForm.svelte";
  import type { Folder } from "$lib/types/location-types";

  subTitle.text = "Add Locations";
  let folderList: Folder[] = [];
  let loading = true;
  let error = "";

  onMount(async () => {
    if (loggedInUser.email) {
      try {
        folderList = await locationService.getFolders(loggedInUser.token);
      } catch (e) {
        error = "Failed to load folders. Please try again.";
      }
    }
    loading = false;
  });
</script>

<Card title="Please Add Location">
  {#if loading}
    <p>Loading folders...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <LocationForm folders={folderList} userToken={loggedInUser.token} />
  {/if}
</Card>
