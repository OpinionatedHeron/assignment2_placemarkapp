<script lang="ts">
  import { InputSanitizer } from "$lib/services/sanitizer-utils";

  let { text = "", allowHtml = false, maxLength = 500 } = $props();

  let safeText = $derived(
   allowHtml
    ? InputSanitizer.sanitizeHtml(text).substring(0, maxLength)
    : InputSanitizer.sanitizeText(text).substring(0, maxLength)
);
</script>

{#if allowHtml}
  {@html safeText}
{:else}
  {safeText}
{/if}
