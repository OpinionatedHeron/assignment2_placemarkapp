<script lang="ts">
  import { subTitle } from "$lib/runes.svelte";
  import Card from "$lib/ui/Card.svelte";
  import LocationList from "$lib/ui/LocationList.svelte";

  subTitle.text = "Saved Locations";
</script>

<Card title="Saved Locations">
  <LocationList />
</Card>
