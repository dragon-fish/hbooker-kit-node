/**
 * @name HBookerKit API Wrapper for 刺猬猫/HBooker Android App
 * @author Dragon-Fish <dragon-fish@qq.com>
 * @license MIT
 */
import axios from 'axios'
import { createHash, createDecipheriv } from 'crypto'
import { ENDPOINTS } from './endpoints'
import {
  HResponse,
  BookItem,
  SelfAccountInfo,
  ShelfItem,
  ShelfBookItem,
  DivisionInfo,
  ChapterInfo,
  ChapterBody,
} from './types'

export { HBookerKit as CiweimaoKit }
export class HBookerKit {
  // Constants
  ENDPOINTS: typeof ENDPOINTS
  API_KEY: string
  APP_VERSION: string
  // Internal variables
  _self?: SelfAccountInfo
  _account?: string
  _loginToken?: string

  constructor() {
    // Caonstants
    this.ENDPOINTS = ENDPOINTS
    this.API_KEY = 'zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn'
    this.APP_VERSION = '2.6.020'
  }

  /****** Utils ******/
  /**
   * Decrypt original response data to JSON
   */
  _decrypt(str: string) {
    const key = createHash('sha256').update(this.API_KEY, 'utf8').digest()
    const decipher = createDecipheriv('aes-256-cbc', key, new Uint8Array(16))
    decipher.setAutoPadding(false)
    let decrypted = decipher.update(str, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
  _decryptJSON(str: string) {
    const text = this._decrypt(str)
    return JSON.parse(text.slice(0, text.lastIndexOf('}') + 1))
  }

  /**
   * Axios generator
   */
  get ajax() {
    const client = axios.create({
      baseURL: this.ENDPOINTS.__BASEURL,
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
      ctx.data = this._decryptJSON(ctx.data)
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

  /**
   * Get book details
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

  async divisionList(book_id: string | number) {
    return (
      await this.ajax.get<HResponse<{ division_list: DivisionInfo[] }>>(
        this.ENDPOINTS.GET_DIVISION_LIST,
        {
          params: {
            book_id,
          },
        }
      )
    ).data
  }

  async chapterList(division_id: string | number) {
    return (
      await this.ajax.get<HResponse<{ chapter_list: ChapterInfo[] }>>(
        this.ENDPOINTS.GET_CHAPTER_UPDATE,
        {
          params: {
            division_id,
          },
        }
      )
    ).data
  }

  async allChapters(book_id: string | number) {
    const list: ChapterInfo[] = []
    const {
      data: { division_list },
    } = await this.divisionList(book_id)

    for (const item of division_list) {
      list.push(...(await this.chapterList(item.division_id)).data.chapter_list)
    }

    return list
  }

  async _chapterCommand(chapter_id: string | number) {
    return (
      await this.ajax.get<HResponse<{ command: string }>>(
        this.ENDPOINTS.GET_CHAPTER_COMMAND,
        {
          params: {
            chapter_id,
          },
        }
      )
    ).data
  }

  async chapter(chapter_id: string | number) {
    const { data } = await this.ajax.get<
      HResponse<{ chapter_info: ChapterBody }>
    >(this.ENDPOINTS.GET_CPT_IFM, {
      params: {
        chapter_id,
        chapter_command: (await this._chapterCommand(chapter_id)).data?.command,
      },
    })
    return data
  }
}
