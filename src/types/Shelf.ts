import { BookInfo } from './Book'

export interface ShelfItem {
  shelf_id: `${number}`
  reader_id: `${number}`
  shelf_name: string
  shelf_index: `${number}`
  book_limit: `${number}`
}

export interface ShelfBookItem {
  book_info: BookInfo
  top_time: `${number}`
  last_read_chapter_id: `${number}`
  last_read_chapter_title: string
  last_read_chapter_update_time: string
}
