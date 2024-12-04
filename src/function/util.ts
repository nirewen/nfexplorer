import Ajv from 'ajv'
import { convertXML } from 'simple-xml-to-json'
import schema from '../assets/nfe.schema.json'

import type { NFFile } from '../types/NFFile'
import { query } from './query'
import type { NFFilter } from './store.svelte'

const ajv = new Ajv()
const validate = ajv.compile(schema)

export async function xmlToJson(file: File) {
  const text = await file.text()
  const json = convertXML(text)

  return {
    name: file.name,
    text,
    json,
    valid: validate(json),
    errors: validate.errors,
  }
}

export function truncate(value: string, length: number, ellipsis = '...') {
  return value.length > length ? value.slice(0, length).trim() + ellipsis : value.trim()
}

export function truncateFileName(fileName: string) {
  const [name, ext] = fileName.split('.')
  let [firstPart, secondPart] = [
    truncate(name.slice(0, name.length / 2), 32),
    truncate(
      name
        .slice(name.length / 2)
        .split('')
        .toReversed()
        .join(''),
      8,
      ''
    )
      .split('')
      .toReversed()
      .join(''),
  ]

  return firstPart + secondPart + '.' + ext
}

export function sortObjectByValue(obj: Record<string, number>) {
  return Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1]))
}

export function filterBySupplierOrCarrier(json: Record<string, NFFile>, { supplier, carrier }: NFFilter) {
  return Object.fromEntries(
    Object.entries(json).filter(([_, { json }]) => {
      const result = query(json, {
        carrier: ['$..transp..xNome.content'],
        supplier: ['$..emit..xNome.content'],
      })
      const supplierMatches = supplier === '' || result.supplier.some(e => e === supplier)
      const carrierMatches = carrier === '' || result.carrier.some(e => e === carrier)

      return supplierMatches && carrierMatches
    })
  )
}
