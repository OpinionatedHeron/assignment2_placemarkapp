<script lang="ts">
  import { loggedInUser, subTitle } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";
  import Card from "$lib/ui/Card.svelte";
  import { onMount } from "svelte";
  import FolderForm from "../folder/FolderForm.svelte";
  import type { Folder, Location } from "$lib/types/location-types";;

  subTitle.text = "Add Folders";

  let folders = $state<Folder[]>([]);
  let locations = $state<Location[]>([]);
  let selectedFolderId = $state("");
  let showFolderForm = $state(false);
  let loading = $state(true);
  let error = $state("");

  let expandedFolders = $state<Set<string>>(new Set());

  let isAuthenticated = $derived(() => loggedInUser.token && loggedInUser._id);

  onMount(async () => {
    if (isAuthenticated) {
      await loadFoldersLocations();
    } else {
      error = "You must be logged in to manage folders.";
    }
    loading = false;
  });

  async function loadFoldersLocations() {
    if (!loggedInUser.token) {
      error = "No token available.";
      return;
    }

    try {
      console.log("Loading folders & locations for user:", loggedInUser.name);
      const [foldersData, locationsData] = await Promise.all([
        locationService.getFolders(loggedInUser.token),
        locationService.getLocations(loggedInUser.token)
      ]);

      folders = foldersData;
      locations = locationsData;
      console.log("Folders and locations loaded")
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

  function getLocationsFolder(folderId: string): Location[] {
    return locations.filter(location => location.folderid === folderId);
  }

  function toggleFolder(folderId: string) {
    if (expandedFolders.has(folderId)) {
      const newSet = new Set(expandedFolders);
      newSet.delete(folderId);
      expandedFolders = newSet;
    } else {
      expandedFolders = new Set([...expandedFolders, folderId]);
    }
  }

  async function deleteFolder(folderId: string, folderName: string) {
    if (!confirm(`Are you sure you want to delete this folder - ${folderName}"? This will delete all locations in the folder also.`)) {
      return;
    }

    try {
      const success = await locationService.deleteFolder(folderId, loggedInUser.token);
      if (success) {
        folders = folders.filter(folder => folder._id !== folderId);
        locations = locations.filter(location => location.folderid !== folderId);
        console.log("Folder deleted!");
      } else {
        error = "Failed to delete folder. Please try again"
      }
    } catch (err) {
      console.error("Error deleting folder:", err);
      error = "Failed to delete folder. Please try again."
    }
  }

  function loginRedirect() {
    loggedInUser.email = "";
    loggedInUser.name = "";
    loggedInUser.token = "";
    loggedInUser._id = "";
    window.location.href = "/login";
  }
</script>

  <Card title="Manage Folders">
    <div class="mb-4">
      <button 
        class="button is-primary" 
        onclick={() => (showFolderForm = !showFolderForm)}
      >
        <span class="icon">
          <i class="fas {showFolderForm ? 'fa-minus' : 'fa-plus'}"></i>
        </span>
        <span>{showFolderForm ? "Cancel" : "Add New Folder"}</span>
      </button>
    </div>

    {#if showFolderForm}
      <div class="box">
        <FolderForm userToken={loggedInUser.token} onFolderCreated={handleFolderCreated} />
      </div>
    {/if}
  </Card>

  <Card title="Your Folders ({folders.length})">
    {#if folders.length === 0}
      <div class="has-text-centered">
        <p class="mb-4">You haven't created any folders yet.</p>
        <button 
          class="button is-primary" 
          onclick={() => (showFolderForm = true)}
        >
          <span class="icon">
            <i class="fas fa-plus"></i>
          </span>
          <span>Create Your First Folder</span>
        </button>
      </div>
    {:else}
      {#each folders as folder}
        {@const folderLocations = getLocationsFolder(folder._id)}
        {@const isExpanded = expandedFolders.has(folder._id)}
        
        <div class="box">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <div>
                  <h4 class="title is-5 mb-1">{folder.name || folder.title}</h4>
                  <p class="subtitle is-6 has-text-grey">
                    {folderLocations.length} location{folderLocations.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="level-right">
              <div class="level-item">
                <div class="buttons">
                  <button 
                    class="button is-small is-info" 
                    onclick={() => toggleFolder(folder._id)}
                  >
                    <span class="icon">
                      <i class="fas {isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
                    </span>
                    <span>{isExpanded ? 'Hide' : 'Show'} Locations</span>
                  </button>
                  
                  <a href="/location" class="button is-small is-success">
                    <span class="icon">
                      <i class="fas fa-plus"></i>
                    </span>
                    <span>Add Location</span>
                  </a>
                  
                  <button 
                    class="button is-small is-danger" 
                    onclick={() => deleteFolder(folder._id, folder.name || folder.title)}
                  >
                    <span class="icon">
                      <i class="fas fa-trash"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {#if isExpanded}
            <div class="content">
              {#if folderLocations.length === 0}
                <div class="notification is-light">
                  <p>No locations in this folder yet.</p>
                  <a href="/location" class="button is-small is-primary mt-2">
                    <span class="icon">
                      <i class="fas fa-plus"></i>
                    </span>
                    <span>Add First Location</span>
                  </a>
                </div>
              {:else}
                <table class="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>Location Name</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Coordinates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each folderLocations as location}
                      <tr>
                        <td>
                          <strong>{location.title}</strong>
                        </td>
                        <td>
                          {location.category}
                        </td>
                        <td>
                          {location.description || 'No description'}
                        </td>
                        <td>
                          {#if location.latitude && location.longitude}
                            <span class="is-size-7">
                              {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
                            </span>
                          {:else}
                            <span class="has-text-grey">No coordinates</span>
                          {/if}
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </Card>


