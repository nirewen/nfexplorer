import { JSONPath } from 'jsonpath-plus'

export type QueryRecord = Record<string, readonly [string, ((elements: unknown[]) => any)?]>

export type QueryResult<T extends QueryRecord> = {
  [K in keyof T]: T[K][1] extends (elements: string[]) => infer R ? R : string[]
}

export function query<T extends QueryRecord>(json: object, data: T): QueryResult<T> {
  return Object.entries(data).reduce((acc, [key, [path, transform]]) => {
    const result = JSONPath({ json, path })
    const value = transform ? transform(result) : result

    return { ...acc, [key]: value }
  }, {} as QueryResult<T>)
}
