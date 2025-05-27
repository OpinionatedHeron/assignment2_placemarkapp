<script lang="ts">
  export let locations = [
    {
      name: "Cliffs of Moher",
      type: "Countryside - Clare",
      user: "fabian@email.com",
      category: "Other",
      visit: "yes",
      notes: "Beautiful cliffs",
      lat: "52.161290",
      lng: "-7.51540"
    },
    {
      name: "Book of Kells",
      type: "City - Dublin",
      user: "kris@email.com",
      category: "Museum",
      visit: "yes",
      notes: "Incredible historical artifact",
      lat: "52.161290",
      lng: "-7.51540"
    },
    {
      name: "Guinness Storehouse",
      type: "City - Dublin",
      user: "fabian@email.com",
      category: "Other",
      visit: "yes",
      notes: "Great brewery tour",
      lat: "52.161290",
      lng: "-7.51540"
    }
  ];
</script>

<table class="table is-fullwidth">
  <thead>
    <tr>
      <th>User</th>
      <th>Name</th>
      <th>Type</th>
      <th>Category</th>
      <th>Visit Again</th>
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
          {location.name}
        </td><td>
          {location.type}
        </td>
        <td>
          {location.category}
        </td>
        <td>
          {location.visit}
        </td>
        <td>
          {location.notes}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
