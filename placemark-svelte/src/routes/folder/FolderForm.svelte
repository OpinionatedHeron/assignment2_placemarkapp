<script lang="ts">
  import { locationService } from "$lib/services/location-service";
  import type { Folder } from "$lib/types/location-types";
  import { InputSanitizer } from "$lib/services/sanitizer-utils";

  let{
    userToken = "",
    onFolderCreated = () => {}
  }: {
    userToken?: string,
    onFolderCreated?: (newFolder: Folder) => void
  } = $props();

  let title = $state("");
  let description = $state("");

  let errorMessage = $state("");
  let isValid = $state(false);

  $effect(() => {
    const sanitizedTitle = InputSanitizer.sanitizeText(title);
    if (title && !sanitizedTitle) {
      errorMessage = "Folder name contains invalid characters";
    } else if (sanitizedTitle && sanitizedTitle.length < 2) {
      errorMessage = "Folder name needs to be at least 2 characters";
    } else{
      errorMessage = "";
    }
  });

  async function createFolder() {
    const sanitizedTitle = InputSanitizer.sanitizeText(title);
    const sanitizedDescription = InputSanitizer.sanitizeText(description);
    if (!sanitizedTitle || sanitizedTitle.length < 2) {
      errorMessage ="Please entera valid folder name.";
      return;
    }
    
    if (!title.trim()) {
      errorMessage = "Folder name is required.";
      return;
    }

    if (!userToken) {
      errorMessage = "Please log in to create folders.";
      return;
    }

    isValid = true;
    errorMessage = "";

    try {
      const folderData = {
        name: title.trim(),
        description: description.trim(),
      };

      console.log("Creating folder:", folderData);

      const result = await locationService.createFolder(folderData, userToken);

      if (result) {
        console.log("Folder created successfully:", result);

        title = "";
        description = "";

        onFolderCreated(result);
      } else {
        errorMessage = "Failed to create folder. Please try again.";
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      errorMessage = "Failed to create folder. Please try again.";
    } finally {
      isValid = false;
    }
  }
</script>


<div>
    <div class="field">
    <label class="label" for="folderName">Folder Name:</label>
    <input
      class="input"
      id="folderTitle"
      bind:value={title}
      type="text"
      placeholder="Enter folder name..."
      required
      /> 
    </div>

  <div class="field">
    <label class="label" for="folderDescription">Description:</label>
    <textarea
      class="textarea"
      id="folderDescription"
      bind:value={description}
      placeholder="Enter folder description..."
      ></textarea>
  </div>

    {#if errorMessage}
        <div class="notification is-danger is-light">
        {errorMessage}
        </div>
    {/if}

  <div class="field">
    <div class="control">
      <button
        class="button is-success is-fullwidth"
        onclick={createFolder}
        disabled={isValid || !title.trim()}
        class:is-loading={isValid}
      >
        {isValid ? "Creating folder..." : "Create Folder"}
      </button>
    </div>
  </div>
</div>
