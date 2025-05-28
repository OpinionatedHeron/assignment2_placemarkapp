<script lang="ts">
  import { goto } from "$app/navigation";
  import { loggedInUser } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";

  locationService.clearSession();
  goto("/");
</script>
