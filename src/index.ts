/**
 * @name HBookerKit API Wrapper for 刺猬猫/HBooker Android App
 * @author Dragon-Fish <dragon-fish@qq.com>
 * @license MIT
 */
import aesjs from 'aes-js'
import axios from 'axios'
import { createHash } from 'crypto'
import { ENDPOINTS } from './endpoints'
import {
  BookItem,
  HResponse,
  SelfAccountInfo,
  ShelfItem,
  ShelfBookItem,
} from './types'

export class HBookerKit {
  // Caonstants
  ENDPOINTS: typeof ENDPOINTS
  API_KEY: string
  INTIAL_VECTOR: number[]
  APP_VERSION: string
  // Internal variables
  _self?: SelfAccountInfo
  _account?: string
  _loginToken?: string

  constructor() {
    // Caonstants
    this.ENDPOINTS = ENDPOINTS
    this.API_KEY = 'zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn'
    this.INTIAL_VECTOR = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.APP_VERSION = '2.6.020'
  }

  /****** Utils ******/
  /**
   * Decrypt original response data to JSON
   */
  _decrypt(str: string) {
    const key = createHash('sha256')
      .update(this.API_KEY, 'utf8')
      .digest()
      .toJSON().data
    const cbc = new aesjs.ModeOfOperation.cbc(key, this.INTIAL_VECTOR)
    const bytes = cbc.decrypt(Buffer.from(str, 'base64'))
    const text = aesjs.utils.utf8.fromBytes(bytes)
    return JSON.parse(text.slice(0, text.lastIndexOf('}') + 1))
  }

  get ajax() {
    const client = axios.create({
      baseURL: this.ENDPOINTS._BASEURL,
      headers: {
        'Accept-Encoding': 'gzip',
        Connection: 'Keep-Alive',
        Host: 'app.hbooker.com',
        'User-Agent': 'Android com.kuangxiangciweimao.novel',
      },
      params: {
        account: this?._account,
        login_token: this?._loginToken,
        app_version: this.APP_VERSION,
      },
    })
    client.interceptors.response.use((ctx) => {
      ctx.data = this._decrypt(ctx.data)
      if (ctx.data?.code && ctx.data.code !== '100000') {
        throw ctx
      }
      return ctx
    })
    return client
  }

  /****** Main methods ******/
  /**
   * Get personal account info & set login state
   * @param login_name E-mail / Phone Number / Booker ID
   */
  async login(login_name: string, passwd: string) {
    this._account = undefined
    this._loginToken = undefined
    const { data } = await this.ajax.get<HResponse<SelfAccountInfo>>(
      this.ENDPOINTS.MY_SIGN_LOGIN,
      {
        params: {
          login_name,
          passwd,
        },
      }
    )
    this._self = data?.data
    this._account = data.data.reader_info.account
    this._loginToken = data.data.login_token
    return data
  }

  /**
   * Get book details view
   */
  async book(book_id: string | number) {
    return (
      await this.ajax.get<HResponse<BookItem>>(
        this.ENDPOINTS.BOOK_GET_INFO_BY_ID,
        {
          params: {
            book_id,
          },
        }
      )
    ).data
  }

  async shelfList() {
    return (
      await this.ajax.get<HResponse<{ shelf_list: ShelfItem[] }>>(
        this.ENDPOINTS.BOOKSHELF_GET_SHELF_LIST
      )
    ).data
  }

  async shelf(shelf_id: string | number) {
    return (
      await this.ajax.get<HResponse<{ book_list: ShelfBookItem[] }>>(
        this.ENDPOINTS.BOOKSHELF_GET_SHELF_BOOK_LIST,
        {
          params: { shelf_id },
        }
      )
    ).data
  }
}

export { HBookerKit as CiweimaoKit }
