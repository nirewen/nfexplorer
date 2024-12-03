<script lang="ts">
  import { files, filesJson, filter } from './function/store.svelte'
  import { filterBySupplierOrCarrier } from './function/util'
  import NFCard from './lib/NFCard.svelte'
  import NFesInfoCard from './lib/NFesInfoCard.svelte'
</script>

<main class="flex h-screen min-h-0 p-3 pr-0">
  <div
    class="flex w-1/3 flex-col gap-2 overflow-y-auto rounded-lg"
    style="scrollbar-width: thin; scrollbar-gutter: stable;"
  >
    <div
      class="m-px flex h-max flex-col gap-2 rounded-lg border border-neutral-500 bg-neutral-700 p-3 text-white outline outline-1 outline-neutral-900"
    >
      <label
        class="w-full cursor-default items-center gap-1 rounded-md bg-neutral-600 px-2 py-1 text-center shadow-sm active:bg-neutral-500"
      >
        <span>Selecionar arquivos</span>
        <input type="file" class="hidden" bind:files={$files} multiple accept="text/xml" />
      </label>
    </div>
    <NFesInfoCard />
  </div>
  <div
    class="flex h-full w-full flex-col gap-2 overflow-y-auto rounded-lg"
    style="scrollbar-width: thin; scrollbar-gutter: stable;"
  >
    {#each Object.values(filterBySupplierOrCarrier($filesJson, $filter)) as file (file.name)}
      <NFCard {file} />
    {:else}
      <div class="flex h-full items-center justify-center text-neutral-500">
        <span>Nenhuma nota fiscal encontrada</span>
      </div>
    {/each}
  </div>
</main>
