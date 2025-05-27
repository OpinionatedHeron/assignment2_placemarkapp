<script lang="ts">
  import Coordinates from "$lib/ui/Coordinates.svelte";

  let lat = $state(52.160858);
  let lng = $state(-7.15242);

  async function location() {
    console.log(`New location: ${locationName} in category ${category}`);
    console.log(`lat: ${lat}, lng: ${lng}`);
  }
</script>

<div>
  <div>
    <label class="label" for="locationName">Location Name:</label>
    <input
      class="input"
      id="locationName"
      name="locationName"
      type="text"
      placeholder="Enter name..."
    />
  </div>
  <div>
    <label class="label" for="locationType">Location Type:</label>
    <input class="input" id="locationType" name="locationType" placeholder="e.g. City, Town..." />
  </div>
  <div class="field">
    <label class="label" for="category">Select Location Category:</label>
    <div class="select">
      <select>
        <option>Restaurant</option>
        <option>Park</option>
        <option>Museum</option>
        <option>Other</option>
      </select>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <label class="label" for="locationType">Visit Again?:</label>
      <input class="radio" type="radio" /> Yes
      <input class="radio" type="radio" /> No
    </div>
  </div>
  <div class="field">
    <label class="label" for="notes">Notes/Info:</label>
    <textarea
      class="textarea"
      id="notes"
      name="notes"
      placeholder="Enter any notes or information..."
    ></textarea>
  </div>
  <Coordinates bind:lat bind:lng />
  <div class="field">
    <div class="control">
      <button class="button is-success is-fullwidth">Save Location</button>
    </div>
  </div>
</div>
