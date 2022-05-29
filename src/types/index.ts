export * from './Book'
export * from './Reader'
export * from './Shelf'

export type StrNumBoolean = '0' | '1'
export type HResponse<T = unknown> = {
  code: `${number}`
  tip?: string
  data: T
}
export type PromiseRes<T = unknown> = Promise<HResponse<T>>
