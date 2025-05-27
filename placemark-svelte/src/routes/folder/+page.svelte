<script lang="ts">
  import { subTitle } from "$lib/runes.svelte";
  import Card from "$lib/ui/Card.svelte";
  import FolderForm from "./FolderForm.svelte";

  subTitle.text = "Add Folders";
</script>

<Card title="Please Add Location Folders">
<FolderForm />
</Card>
