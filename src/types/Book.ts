import { StrNumBoolean } from '.'
import { ReaderInfo } from './Reader'

export interface BookInfo {
  book_id: `${string}`
  book_name: string
  description: string
  book_src: '本站首发' | '其他首发'
  category_index: `${number}`
  tag: string
  total_word_count: `${number}`
  up_status: StrNumBoolean
  update_status: StrNumBoolean
  is_paid: StrNumBoolean
  discount: StrNumBoolean
  discount_end_time: string
  cover: string
  author_name: string
  uptime: string
  newtime: string
  review_amount: `${number}`
  reward_amount: `${number}`
  chapter_amount: `${number}`
  is_original: StrNumBoolean
  total_click: `${number}`
  month_click: `${number}`
  week_click: `${number}`
  month_no_vip_click: `${number}`
  week_no_vip_click: `${number}`
  total_recommend: `${number}`
  month_recommend: `${number}`
  week_recommend: `${number}`
  total_favor: `${number}`
  month_favor: `${number}`
  week_favor: `${number}`
  current_yp: `${number}`
  total_yp: `${number}`
  current_blade: `${number}`
  total_blade: `${number}`
  week_fans_value: `${number}`
  month_fans_value: `${number}`
  total_fans_value: `${number}`
  last_chapter_info: ChapterInfo
  tag_list: Tag[]
}

export interface BookItem {
  book_info: BookInfo
  is_inshelf: StrNumBoolean
  is_buy: StrNumBoolean
  up_reader_info: ReaderInfo
  related_list: BookInfo[]
  book_shortage_reommend_list: any[]
}

export interface ChapterInfo {
  chapter_id: `${number}`
  book_id: `${number}`
  chapter_index: `${number}`
  chapter_title: string
  uptime: string
  mtime: string
  recommend_book_info: string
}

export interface Tag {
  tag_id: `${number}`
  tag_type: `${number}`
  tag_name: string
}
