<script lang="ts">
  import { loggedInUser, subTitle } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";
  import Card from "$lib/ui/Card.svelte";
  import { onMount } from "svelte";
  import LocationForm from "../location/LocationForm.svelte";
  import FolderForm from "../folder/FolderForm.svelte";
  import type { Folder } from "$lib/types/location-types";
  import { writable } from "svelte/store";

  subTitle.text = "Add Folders";

  let folders = $state<Folder[]>([]);
  let selectedFolderId = $state("");
  let showFolderForm = $state(false);
  let loading = $state(true);
  let error = $state("");

  let isAuthenticated = $derived(() => loggedInUser.token && loggedInUser._id);

  onMount(async () => {
    if (isAuthenticated) {
      await loadFolders();
    } else {
      error = "You must be logged in to manage folders.";
    }
    loading = false;
  });

  async function loadFolders() {
    if (!loggedInUser.token) {
      error = "No token available.";
      return;
    }

    try {
      console.log("Loading folders for user:", loggedInUser.name);
      folders = await locationService.getFolders(loggedInUser.token);
      console.log("Folders loaded:", folders);
      error = "";
    } catch (err) {
      console.error("Error loading folders:", err);
      error = "Failed to load folders. Please try again.";

      if (err?.response?.status === 401) {
        loggedInUser.email = "";
        loggedInUser.name = "";
        loggedInUser.token = "";
        loggedInUser._id = "";
      }
    }
  }

  function handleFolderCreated(newFolder: Folder) {
    console.log("New folder created by:", loggedInUser.name);
    folders = [...folders, newFolder];
    selectedFolderId = newFolder._id;
    showFolderForm = false;
  }

  function handleLocationCreated() {
    console.log("Location created successfully by:", loggedInUser.name);
  }

  function loginRedirect() {
    loggedInUser.email = "";
    loggedInUser.name = "";
    loggedInUser.token = "";
    loggedInUser._id = "";
    window.location.href = "/login";
  }
</script>

<Card title="Please Add Location Folders">
  {#if loading}
    <p>Loading folders...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if isAuthenticated}
  <div class="control-section">
    <button class="button is-primary" onclick={() => (showFolderForm = !showFolderForm)}>
      {showFolderForm ? "Hide Folder Form" : "Add New Folder"}
    </button>
</div>
    {#if showFolderForm}
      <FolderForm userToken={loggedInUser.token} onFolderCreated={handleFolderCreated} />
    {/if}
  {:else}
    <p>
      You must be logged in to manage folders. <button
        class="button is-link"
        onclick={loginRedirect}>Log In</button
      >
    </p>
  {/if}
</Card>
