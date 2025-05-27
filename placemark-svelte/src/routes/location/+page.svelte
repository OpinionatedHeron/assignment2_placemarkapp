<script lang="ts">
  import { subTitle } from "$lib/runes.svelte";
  import Card from "$lib/ui/Card.svelte";
  import LocationForm from "./LocationForm.svelte";

  subTitle.text = "Add Locations";
</script>

<Card title="Please Add Location">
<LocationForm />
</Card>
