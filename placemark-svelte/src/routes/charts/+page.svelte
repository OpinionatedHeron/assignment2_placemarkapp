<script>
  import { onMount } from "svelte";
  import { subTitle, loggedInUser, currentDataSets } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";
  import { computeByCategory, computeByFolder } from "$lib/services/location-utils";
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  
  subTitle.text = "Placemark Data";

  let locations = [];
  let folders = [];
  let loading = false;
  let error = "";

  onMount(async () => {
    loading = true;
    error = "";
    try {
      if (!loggedInUser.token) {
        error = "You must be logged in to view charts.";
        loading = false;
        return;
      }
      [locations, folders] = await Promise.all([
        locationService.getLocations(loggedInUser.token),
        locationService.getFolders(loggedInUser.token)
      ]);

      computeByCategory(locations);
      computeByFolder(locations, folders);

    } catch (e) {
      error = "Failed to load chart data.";
      console.error(e);
    }
    loading = false;
  });
</script>

{#if loading}
  <p>Loading charts...</p>
{:else if error}
  <div class="notification is-danger">{error}</div>
{:else}
  <div class="columns">
    <div class="column box has-test-centered">
      <h1 class="title is-5">Location by Category</h1>
      <Chart data={currentDataSets.locationsByCategory} type="bar" />
    </div>
    <div class="column box has-test-centered">
      <h1 class="title is-5">Location by Folder</h1>
      <Chart data={currentDataSets.locationsByFolder} type="pie" />
    </div>
  </div>
{/if}
