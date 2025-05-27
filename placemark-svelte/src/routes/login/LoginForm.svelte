<script lang="ts">
  import { goto } from "$app/navigation";
  import { loggedInUser } from "$lib/runes.svelte";
  import { locationService } from "$lib/services/location-service";
  import Message from "$lib/ui/Message.svelte";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";

  let email = $state("");
  let password = $state("");
  let message = $state("");

  async function login() {
    console.log(`Attempting to log in with email: ${email} and password: ${password}`);
    let session = await locationService.login(email, password);
    if (session) {
      loggedInUser.email = email;
      loggedInUser.name = session.name;
      loggedInUser.token = session.token;
      loggedInUser._id = session._id;
      console.log(`Session: ${JSON.stringify(session)}`);
      goto("/location");
    } else {
      email = "";
      password = "";
      message = "Error trying to log in";
    }
  }
</script>

<div class="box">
  {#if message}
    <Message {message} />
  {/if}
  <UserCredentials bind:email bind:password />
  <button class="button is-success is-fullwidth" on:click={login}>Log In</button>
</div>
