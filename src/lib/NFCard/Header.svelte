<script lang="ts">
  import DownloadIcon from '~icons/fluent/arrow-download-20-regular'
  import CheckIcon from '~icons/fluent/checkmark-20-filled'
  import DismissIcon from '~icons/fluent/dismiss-20-regular'
  import ReceiptIcon from '~icons/fluent/receipt-20-regular'

  import { query } from '../../function/query'
  import { truncateFileName } from '../../function/util'

  const { file } = $props()

  const result = query(file.json, {
    codigo: ['$..ide..cNF.content'],
  })

  function downloadReceipt() {
    const blob = new Blob([JSON.stringify(file.json, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = file.name.replace(/\.xml$/, '.json')
    a.click()
  }
</script>

<div class="flex flex-col gap-1 p-3">
  <div class="flex items-center gap-2">
    <ReceiptIcon />
    <code class="w-fit rounded-md bg-neutral-600 px-2 py-1">{result.codigo}</code>
    <code class="w-fit rounded-md bg-neutral-600 px-2 py-1">{truncateFileName(file.name)}</code>
    {#if file.valid}
      <span class="ml-auto flex w-fit items-center gap-2 rounded-md bg-emerald-700 px-2 py-1">
        <CheckIcon />
        Válido
      </span>
    {:else}
      <span class="ml-auto flex w-fit items-center gap-2 rounded-md bg-red-700 px-2 py-1">
        <DismissIcon />
        Inválido
      </span>
    {/if}
    <button
      class="flex w-fit cursor-default items-center gap-1 rounded-md bg-neutral-600 px-2 py-1 active:bg-neutral-500"
      onclick={downloadReceipt}
    >
      <DownloadIcon />
      Download JSON
    </button>
  </div>
</div>
