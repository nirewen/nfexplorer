<script lang="ts">
  import DownloadIcon from '~icons/fluent/arrow-download-20-regular'
  import CodeIcon from '~icons/fluent/braces-20-regular'
  import ShoppingBagPercent from '~icons/fluent/shopping-bag-percent-20-regular'
  import TagIcon from '~icons/fluent/tag-20-regular'
  import { query } from '../../function/query'

  const { produto } = $props()

  const result = query(produto, {
    codigo: ['$..cProd.content'],
    nome: ['$..xProd.content'],
    imposto: [
      "$..imposto..[?(['vICMS', 'vIPI', 'vPIS', 'vCOFINS'].includes(@property))].content",
      elements => {
        const [ICMS, IPI, PIS, COFINS] = elements.map(Number)

        return { ICMS, IPI, PIS, COFINS }
      },
    ],
  })

  function downloadProduct() {
    const blob = new Blob([JSON.stringify(produto, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = 'produto.json'
    a.click()
  }
</script>

<div class="grid grid-cols-[1fr_2fr] gap-4 p-3">
  <div class="flex flex-col gap-1">
    <span class="flex items-center gap-2 whitespace-nowrap">
      <CodeIcon />
      Código do produto
    </span>
    <span class="flex items-center gap-1">
      {#each result.codigo as codigo}
        <code class="w-fit rounded-md bg-neutral-700 px-2 py-1 outline outline-1 outline-neutral-600">{codigo}</code>
      {/each}
    </span>
  </div>
  <div class="flex flex-1 flex-col gap-1">
    <span class="flex items-center gap-2">
      <TagIcon />
      Nome do produto
    </span>
    <span class="flex w-full flex-col gap-1 whitespace-nowrap">
      {#each result.nome as nome}
        <span class="w-full truncate rounded-md bg-neutral-700 px-2 py-1 outline outline-1 outline-neutral-600">
          {nome}
        </span>
      {/each}
    </span>
  </div>
  {#if true}
    {@const impostos = Object.entries(result.imposto).filter(([tax, value]) => !!value)}
    {#if impostos.length > 0}
      <div class="flex flex-col gap-1">
        <span class="flex items-center gap-2">
          <ShoppingBagPercent />
          Impostos
        </span>
        <span class="flex flex-col gap-1 whitespace-nowrap">
          {#each impostos as [tax, value]}
            <div class="flex gap-1">
              <span class="w-fit rounded-md bg-neutral-700 px-2 py-1 outline outline-1 outline-neutral-600">
                {tax}
              </span>
              <span class="w-fit rounded-md bg-neutral-700 px-2 py-1 outline outline-1 outline-neutral-600">
                R$ {value.toFixed(2)}
              </span>
            </div>
          {/each}
        </span>
      </div>
    {/if}
  {/if}
  <div class="flex flex-col gap-1">
    <span class="flex flex-col gap-1 whitespace-nowrap">
      <button
        class="flex w-fit cursor-default items-center gap-1 rounded-md bg-neutral-600 px-2 py-1 active:bg-neutral-500"
        onclick={downloadProduct}
      >
        <DownloadIcon />
        Download JSON
      </button>
    </span>
  </div>
</div>
