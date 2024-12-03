<script lang="ts">
  import { query } from '../function/query'
  import type { NFFile } from '../types/NFFile'
  import Header from './NFCard/Header.svelte'
  import Product from './NFCard/Product.svelte'

  type Props = {
    file: NFFile
  }

  const { file }: Props = $props()

  const result = query(file.json, {
    produtos: ['$..det', elements => elements as object[]],
  })
</script>

<div
  class="m-px flex flex-col divide-y divide-neutral-600 rounded-lg border border-neutral-500 bg-neutral-700 text-white outline outline-1 outline-neutral-900"
>
  <Header {file} />
  {#each result.produtos as produto}
    <Product {produto} />
  {/each}
</div>
