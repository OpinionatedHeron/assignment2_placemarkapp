<script lang="ts">
    let { locations } = $props();
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
      <tr>
        <td>
          {location.user}
        </td>
        <td>
          {location.folder}
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
