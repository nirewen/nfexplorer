<script lang="ts">
  import BoxIcon from '~icons/fluent/box-20-regular'
  import CalcIcon from '~icons/fluent/calculator-20-regular'
  import ReceiptIcon from '~icons/fluent/receipt-20-regular'
  import ShoppingBagPercent from '~icons/fluent/shopping-bag-percent-20-regular'

  import { query } from '../function/query'
  import { filesJson } from '../function/store.svelte'
  import { sortObjectByValue } from '../function/util'

  $: infos = query($filesJson, {
    totalReceipts: ['$..nfeProc', elements => elements.length],
    totalProducts: ['$..prod', elements => elements.length],
    totalPrice: ['$..prod..vUnTrib.content', elements => elements.map(Number).reduce((sum, curr) => sum + curr, 0)],
    suppliers: ['$..emit..xNome.content', elements => elements.toSorted()],
    carriers: ['$..transp..xNome.content', elements => elements.toSorted()],
    tax: [
      "$..total..ICMSTot..[?(['vICMS', 'vIPI', 'vPIS', 'vCOFINS'].includes(@property))].content",
      elements => {
        const result = (elements as string[]).reduce(
          (acc, curr: string, index: number) => {
            const key = (['ICMS', 'IPI', 'PIS', 'COFINS'] as const)[index % 4]

            acc[key] += Number(curr)

            return acc
          },
          { ICMS: 0, IPI: 0, PIS: 0, COFINS: 0 }
        )

        return result
      },
    ],
  })
</script>

<div
  class="m-px flex h-max flex-col gap-2 rounded-lg border border-neutral-500 bg-neutral-700 p-3 text-white outline outline-1 outline-neutral-900"
>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <ReceiptIcon />
      <span class="whitespace-nowrap">Número de notas</span>
    </div>
    <div class="ml-7 flex flex-col">
      <span class="w-fit rounded-md bg-neutral-600 px-2 py-1 text-xl font-bold">{infos.totalReceipts} notas</span>
    </div>
  </div>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <BoxIcon />
      <span class="whitespace-nowrap">Número de produtos</span>
    </div>
    <div class="ml-7 flex flex-col">
      <span class="w-fit rounded-md bg-neutral-600 px-2 py-1 text-xl font-bold">{infos.totalProducts} produtos</span>
    </div>
  </div>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <CalcIcon />
      <span class="whitespace-nowrap">Preço total</span>
    </div>
    <div class="ml-7 flex flex-col">
      <span class="w-fit rounded-md bg-neutral-600 px-2 py-1 text-xl font-bold">R$ {infos.totalPrice.toFixed(2)}</span>
    </div>
  </div>
  {#if Object.values(infos.tax).some(value => value > 0)}
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <ShoppingBagPercent />
        <span class="whitespace-nowrap">Total de impostos</span>
      </div>
      <div class="ml-7 flex flex-col gap-1">
        {#each Object.entries(sortObjectByValue(infos.tax)) as [tax, value]}
          <div class="flex gap-1">
            <span class="w-fit whitespace-nowrap rounded-md bg-neutral-600 px-2 py-1">{tax}</span>
            <span class="w-fit whitespace-nowrap rounded-md bg-neutral-600 px-2 py-1">R$ {value.toFixed(2)}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
