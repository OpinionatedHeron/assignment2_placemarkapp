<script>
  import { onMount } from "svelte";
  import { subTitle, loggedInUser } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";
  // @ts-ignore
  import Chart from "svelte-frappe-charts";

  subTitle.text = "Placemark Data";

  let locations = [];
  let folders = [];
  let loading = false;
  let error = "";

  let locationsByCategory = {
    labels: [],
    datasets: [{ values: [] }]
  };

  let locationsByFolder = {
    labels: [],
    datasets: [{ values: [] }]
  };

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

      const categoryCounts = {};
      locations.forEach((loc) => {
        if (loc.category) {
          categoryCounts[loc.category] = (categoryCounts[loc.category] || 0) + 1;
        }
      });
      locationsByCategory.labels = Object.keys(categoryCounts);
      locationsByCategory.datasets[0].values = Object.values(categoryCounts);

      const folderMap = {};
      folders.forEach(folder => {
        folderMap[folder._id] = folder.name || folder.title || "Unknown";
      });

      const folderCounts = {};
      locations.forEach((loc) => {
        const folderName = folderMap[loc.folderid] || "Unknown";
        folderCounts[folderName] = (folderCounts[folderName] || 0) + 1;      
    });

      locationsByFolder.labels = Object.keys(folderCounts);
      locationsByFolder.datasets[0].values = Object.values(folderCounts);
      
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
      <Chart data={locationsByCategory} type="bar" />
    </div>
    <div class="column box has-test-centered">
      <h1 class="title is-5">Location by Folder</h1>
      <Chart data={locationsByFolder} type="pie" />
    </div>
  </div>
{/if}
