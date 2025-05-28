<script lang="ts">
  import Coordinates from "$lib/ui/Coordinates.svelte";
  import { locationService } from "$lib/services/location-service";
  import type { Folder } from "$lib/types/location-types";
  import { currentLocations, currentFolders } from "$lib/runes.svelte";

  let {
    folders = [],
    selectedFolderId = $bindable(""),
    userToken = "",
    onLocationCreated = () => {}
  }: {
    folders?: Folder[];
    selectedFolderId?: string;
    userToken?: string;
    onLocationCreated?: () => void;
  } = $props();

  let title = $state("");
  let category = $state("Restaurant");
  let description = $state("");
  let lat = $state(52.160858);
  let lng = $state(-7.15242);

  let currentLocation = $state(null);
  let currentFolder = $state(null);

  let errorMessage = $state("");
  let isValid = $state(false);

  $effect(() => {
    currentFolder = folders.find((folder) => folder._id === selectedFolderId) || null;
  });

  async function createLocation() {
    if (!title.trim()) {
      errorMessage = "Location name is required.";
      return;
    }

    if (!selectedFolderId) {
      errorMessage = "Please select a folder.";
      return;
    }

    if (!userToken) {
      errorMessage = "Please log in to create and save locations.";
      return;
    }

    isValid = true;
    errorMessage = "";

    try {
      const locationData = {
        title: title.trim(),
        category: category,
        description: description.trim(),
        latitude: lat,
        longitude: lng
      };

      const result = await locationService.createLocation(
        selectedFolderId,
        locationData,
        userToken
      );

      if (result) {
        currentLocation = result;

        title = "";
        category = "Restaurant";
        description = "";
        lat = 52.160858;
        lng = -7.15242;

        onLocationCreated();
      } else {
        errorMessage = "";
      }
    } catch (error) {
      console.error("Error creating location:", error);
      errorMessage = "Failed to create location. Please try again.";
    } finally {
      isValid = false;
    }

    console.log(`New location: ${title} in category ${category}`);
    console.log(`lat: ${lat}, lng: ${lng}`);
  }
</script>

<div>
  <div class="field">
    <label class="label" for="folder">Select Folder:</label>
    <div class="select is-fullwidth">
      <select bind:value={selectedFolderId} id="folder" required>
        <option value="">Choose folder...</option>
        {#each folders as folder}
          <option value={folder._id}>{folder.title}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="field">
    <label class="label" for="locationName">Location Name:</label>
    <input
      class="input"
      id="locationName"
      bind:value={title}
      type="text"
      placeholder="Enter location name..."
      required
    />
  </div>

  <div class="field">
    <label class="label" for="category">Select Location Category:</label>
    <div class="select is-fullwidth">
      <select bind:value={category} id="category">
        <option>Restaurant</option>
        <option>Park</option>
        <option>Museum</option>
        <option>Hotel/Hostel</option>
        <option>Shopping</option>
        <option>Tourist Attraction</option>
        <option>Other</option>
      </select>
    </div>
  </div>

  <div class="field">
    <label class="label" for="notes">Notes/Description:</label>
    <textarea
      class="textarea"
      id="description"
      bind:value={description}
      placeholder="Enter any notes or information..."
    ></textarea>
  </div>

  <Coordinates bind:lat bind:lng />
  {#if currentFolder}
    <div class="notification is-info is-light">
      <strong>Current Folder:</strong>
      {currentFolder.title}
    </div>
  {/if}

  {#if currentLocation}
    <div class="notification is-success is light">
      <strong>Most Recent Location Added:</strong>
      {currentLocation.title}
    </div>
  {/if}

  <div class="field">
    <div class="control">
      <button
        class="button is-success is-fullwidth"
        onclick={createLocation}
        disabled={isValid || !title.trim() || !selectedFolderId}
        class:is-loading={isValid}
      >
        {isValid ? "Saving..." : "Save Location"}
      </button>
    </div>
  </div>
</div>
