<script lang="ts">
  import BoxIcon from '~icons/fluent/box-20-regular'
  import SupplierIcon from '~icons/fluent/box-multiple-20-regular'
  import CalcIcon from '~icons/fluent/calculator-20-regular'
  import DismissIcon from '~icons/fluent/dismiss-20-regular'
  import ReceiptIcon from '~icons/fluent/receipt-20-regular'
  import ShoppingBagPercentIcon from '~icons/fluent/shopping-bag-percent-20-regular'
  import CarrierIcon from '~icons/fluent/vehicle-truck-bag-20-regular'

  import { query } from '../function/query'
  import { filesJson, filter } from '../function/store.svelte'
  import { sortObjectByValue } from '../function/util'

  $: infos = query($filesJson, {
    totalReceipts: ['$..nfeProc', elements => elements.length],
    totalProducts: ['$..prod', elements => elements.length],
    totalPrice: ['$..prod..vUnTrib.content', elements => elements.map(Number).reduce((sum, curr) => sum + curr, 0)],
    suppliers: ['$..emit..xNome.content', elements => elements.toSorted() as string[]],
    carriers: ['$..transp..xNome.content', elements => [...new Set(elements)].toSorted() as string[]],
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

  function selectSupplier(supplier: string) {
    $filter.supplier = supplier
  }

  function selectCarrier(carrier: string) {
    $filter.carrier = carrier
  }
</script>

<div
  class="m-px flex h-max flex-col gap-2 rounded-xl border border-neutral-500 bg-neutral-700 p-3 text-white outline outline-1 outline-neutral-900"
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
        <ShoppingBagPercentIcon />
        <span class="whitespace-nowrap">Total de impostos</span>
      </div>
      <div class="ml-7 flex flex-col gap-1">
        {#each Object.entries(sortObjectByValue(infos.tax)) as [tax, value]}
          <div class="flex w-fit rounded-md border border-neutral-600">
            <span class="whitespace-nowrap px-2 py-1">{tax}</span>
            <span class="whitespace-nowrap bg-neutral-600 px-2 py-1">
              R$ {value.toFixed(2)}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  {#if infos.suppliers.length > 0}
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <SupplierIcon />
        <span class="whitespace-nowrap">Fonecedores</span>
      </div>
      <div class="ml-7 flex flex-col gap-1">
        {#each infos.suppliers as supplier}
          <div class="flex">
            <button
              class="w-full cursor-default truncate rounded-md bg-neutral-600 px-2 py-1 text-left shadow-sm active:bg-neutral-500"
              class:rounded-r-none={supplier === $filter.supplier}
              onclick={() => selectSupplier(supplier)}
            >
              {supplier}
            </button>
            {#if supplier === $filter.supplier}
              <button
                class="cursor-default truncate rounded-md rounded-l-none bg-neutral-600 px-2 py-1 shadow-sm active:bg-neutral-500"
                onclick={() => selectSupplier('')}
              >
                <DismissIcon />
              </button>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
  {#if infos.carriers.length > 0}
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <CarrierIcon />
        <span class="whitespace-nowrap">Transportadores</span>
      </div>
      <div class="ml-7 flex flex-col gap-1">
        {#each infos.carriers as carrier}
          <div class="flex">
            <button
              class="w-full cursor-default truncate rounded-md bg-neutral-600 px-2 py-1 text-left shadow-sm active:bg-neutral-500"
              class:rounded-r-none={carrier === $filter.carrier}
              onclick={() => selectCarrier(carrier)}
            >
              {carrier}
            </button>
            {#if carrier === $filter.carrier}
              <button
                class="cursor-default truncate rounded-md rounded-l-none bg-neutral-600 px-2 py-1 shadow-sm active:bg-neutral-500"
                onclick={() => selectCarrier('')}
              >
                <DismissIcon />
              </button>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
