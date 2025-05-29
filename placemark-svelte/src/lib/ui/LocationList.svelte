<script lang="ts">
  import SafeText from "./SafeText.svelte";
  
    export let locations = [];
    export let currentLocation = null;
</script>

<table class="table is-fullwidth">
  <thead>
    <tr>
      <th>User</th>
      <th>Folder</th>
      <th>Location Name</th>
      <th>Category</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    {#each locations as location}
      <tr class={currentLocation && location.id === currentLocation.id ? "is-selected" : ""}>
        <td>
          {location.user?.name || location.userName || "Unknown User"}
        </td>
        <td>
          {location.folder?.name || location.folder?.title || location.folderName || "Unknown Folder"}
        </td>
        <td>
          {location.title}
        </td>
        <td>
          {location.category}
        </td>
        <td>
          {location.description}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
