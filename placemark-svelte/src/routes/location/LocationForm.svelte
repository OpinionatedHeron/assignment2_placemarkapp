<script lang="ts">
  import Coordinates from "$lib/ui/Coordinates.svelte";
  import { locationService } from "$lib/services/location-service";
  import type { Folder } from "$lib/types/location-types";

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

  let errorMessage = $state("");
  let isValid = $state(false);

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

      console.log("Creating location:", locationData);

      const result = await locationService.createLocation(
        selectedFolderId,
        locationData,
        userToken
      );

      if (result) {
        console.log("Location created successfully:", result);

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
      <select>
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
  {#if errorMessage}
    <div class="notification is-danger">
      {errorMessage}
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
