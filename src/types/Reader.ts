import { StrNumBoolean } from '.'

export interface SelfAccountInfo {
  login_token: string
  user_code: string
  reader_info: ReaderInfo
  prop_info: UserPropInfo
}

export interface ReaderInfo {
  reader_id: `${number}`
  account: `书客${number}`
  is_bind: StrNumBoolean
  is_bind_qq: StrNumBoolean
  is_bind_weixin: StrNumBoolean
  is_bind_huawei: StrNumBoolean
  is_bind_apple: StrNumBoolean
  phone_num: `${number}`
  phone_crypto: string
  mobileVal: StrNumBoolean
  email: string
  license: string
  reader_name: string
  avatar_url: string
  avatar_thumb_url: string
  base_status: StrNumBoolean
  exp_lv: `${number}`
  exp_value: `${number}`
  gender: '0' | '1' | '2'
  vip_lv: `${number}`
  vip_value: `${number}`
  is_author: StrNumBoolean
  book_age: `${number}`
  category_prefer: string[]
  used_decoration: any[]
  rank: `${number}`
  ctime: string
}

export interface UserPropInfo {
  rest_gift_hlb: `${number}`
  rest_hlb: `${number}`
  rest_yp: `${number}`
  rest_recommend: `${number}`
  rest_total_blade: `${number}`
  rest_month_blade: `${number}`
  rest_total_100: `${number}`
  rest_total_588: `${number}`
  rest_total_1688: `${number}`
  rest_total_5000: `${number}`
  rest_total_10000: `${number}`
  rest_total_100000: `${number}`
}
