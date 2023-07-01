<script lang="ts">
  import { MetaTags } from "../lib/components/meta";

  let search: string | null = null;

  const handleSearch = () => {
    if (search !== null) {
      window.location.href = `https://google.com/search?q=${search}`;
    }
  };
</script>

<svelte:head>
  <MetaTags />
</svelte:head>

<div class="flex flex-col items-center justify-center mt-20 md:mt-0 px-3 md:px-0 md:h-screen">
  <img src="/simplist.png" alt="plus" class="h-16" />

  <div class="flex bg-[#1E293B] rounded-full p-1 mt-4 w-full max-w-2xl">
    <div class="bg-[#2B3A52] flex rounded-full p-2 ml-0.5">
      <img src="/providers/google.png" alt="google icon" class="h-8 w-8" />
    </div>

    <form class="flex flex-1" on:submit|preventDefault={handleSearch}>
      <input
        autofocus
        type="text"
        placeholder="Combien y a t&apos;il d&apos;humains sur Terre ?"
        class="text-[#707F97] w-full placeholder-[#707F97] outline-none ml-2 bg-transparent"
        bind:value={search}
      />

      <button class="text-[#707F97] p-3 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10 14l11 -11"></path>
          <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
        </svg>
      </button>
    </form>
  </div>
</div>

<!-- fixed bottom -->
<div class="fixed bottom-0 right-0 flex justify-center items-center px-3 py-3 gap-2">
  <a class="text-[#707F97] hover:text-[#FFFFFF] transition-colors duration-200 hover:underline" href="/">Paramètres</a>
</div>