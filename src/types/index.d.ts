import { AxiosInstance } from 'axios'
import { BookRoute } from './Book'
import { SelfAccountInfo } from './Reader'

type StrNumBoolean = '0' | '1'
type HResponse<T = unknown> = {
  code: `${number}`
  tip?: string
  data: T
}
type PromiseRes<T = unknown> = Promise<HResponse<T>>

/**
 * @class HBookerKit
 */
export interface HBookerKit {
  // internal variables
  _self?: SelfAccountInfo

  // constructor
  constructor: () => this

  // utils
  _decrypt: <T>(str: string) => HResponse<T>
  ajax: AxiosInstance

  // main methods
  /**
   * Get self user info & set current user stats
   * @param login_name email address / phone number / booker id
   */
  login: (login_name: string, passwd: string) => PromiseRes<SelfAccountInfo>
  book: (book_id: string | number) => PromiseRes<BookRoute>
}
