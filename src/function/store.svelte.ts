import { derived, writable, type Writable } from 'svelte/store'
import type { NFFile } from '../types/NFFile'
import { xmlToJson } from './util'

export type NFFilter = {
  supplier: string
  carrier: string
}

export const filter = writable<NFFilter>({
  supplier: '',
  carrier: '',
})
export const files = writable<FileList>()
export const filesJson = derived<Writable<FileList>, Record<string, NFFile>>(
  files,
  (files, set) => {
    set({})
    Promise.all(Array.from(files ?? []).map(xmlToJson))
      .then(filesJson =>
        filesJson.reduce(
          (acc, file) => ({
            ...acc,
            [file.name]: file,
          }),
          {} as Record<string, NFFile>
        )
      )
      .then(set)
  },
  {}
)
