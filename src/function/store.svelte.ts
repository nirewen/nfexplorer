import Ajv from 'ajv'
import { convertXML } from 'simple-xml-to-json'
import schema from '../assets/nfe.schema.json'

import { derived, writable, type Writable } from 'svelte/store'
import type { NFFile } from '../types/NFFile'

const ajv = new Ajv()
const validate = ajv.compile(schema)

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
    new Promise<Record<string, NFFile>>(async resolve => {
      let filesJson = {} as Record<string, NFFile>

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files.item(i)

          if (file) {
            await file.text().then(text => {
              const json = convertXML(text)

              filesJson[file.name] = {
                name: file.name,
                text,
                json,
                valid: validate(json),
                errors: validate.errors,
              }
            })
          }
        }
      }

      resolve(filesJson)
    }).then(set)
  },
  {}
)
