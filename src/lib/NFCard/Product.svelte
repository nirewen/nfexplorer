<script lang="ts">
  import DownloadIcon from '~icons/fluent/arrow-download-20-regular'
  import CodeIcon from '~icons/fluent/braces-20-regular'
  import CoinsIcon from '~icons/fluent/coin-stack-20-regular'
  import ShoppingBagPercent from '~icons/fluent/shopping-bag-percent-20-regular'
  import TagIcon from '~icons/fluent/tag-20-regular'

  import { query } from '../../function/query'
  import { sortObjectByValue } from '../../function/util'

  const { produto } = $props()

  const result = query(produto, {
    codigo: ['$..cProd.content'],
    nome: ['$..xProd.content'],
    preco: ['$..vProd.content', elements => elements.map(Number)],
    quantidade: ['$..qCom.content', elements => elements.map(Number)],
    valorUnitario: ['$..vUnCom.content', elements => elements.map(Number)],
    tipo: ['$..uCom.content'],
    desconto: ['$..vDesc.content', elements => elements.map(Number)],
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
    a.download = `${result.codigo[0]}.json`
    a.click()
  }
</script>

<div class="grid grid-cols-[1fr_3fr] gap-4 p-3">
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
  <div class="flex min-w-0 flex-1 flex-col gap-1">
    <span class="flex items-center gap-2">
      <TagIcon />
      Nome do produto
    </span>
    <span class="flex w-full flex-col gap-1">
      {#each result.nome as nome}
        <span class="truncate rounded-md bg-neutral-700 px-2 py-1 outline outline-1 outline-neutral-600">
          {nome}
        </span>
      {/each}
    </span>
  </div>
  <div class="flex flex-col gap-4">
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <span class="flex items-center gap-2">
        <CoinsIcon />
        Preço
      </span>
      <span class="flex w-full flex-col gap-1">
        {#each result.preco as preco}
          <span class="truncate rounded-md bg-neutral-700 px-2 py-1 outline outline-1 outline-neutral-600">
            {result.quantidade}&times; R$ {preco.toFixed(2)}
          </span>
        {/each}
      </span>
      {#each result.valorUnitario as valorUnitario}
        <span class="truncate rounded-md bg-neutral-700 px-2 py-1 outline outline-1 outline-neutral-600">
          R$ {valorUnitario.toFixed(2)} <small>/ {result.tipo}</small>
        </span>
      {/each}
      {#each result.desconto as desconto}
        <span
          class="flex items-center gap-1 truncate rounded-md bg-neutral-700 px-2 py-1 outline outline-1 outline-neutral-600"
        >
          &minus;R$ {desconto.toFixed(2)}
        </span>
      {/each}
    </div>
  </div>
  <div class="flex flex-1 gap-4">
    {#if true}
      {@const impostos = Object.entries(sortObjectByValue(result.imposto)).filter(([tax, value]) => !!value)}
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
    <div class="ml-auto flex flex-col-reverse gap-1 odd:col-span-2">
      <span class="flex flex-col gap-1 whitespace-nowrap">
        <button
          class="flex w-fit cursor-default items-center gap-1 rounded-md bg-neutral-600 px-2 py-1 shadow-sm active:bg-neutral-500"
          onclick={downloadProduct}
        >
          <DownloadIcon />
          Download JSON
        </button>
      </span>
    </div>
  </div>
</div>
