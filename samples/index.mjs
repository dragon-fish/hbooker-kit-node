import 'dotenv/config'
import { HBookerKit } from '../lib/index.js'

const app = new HBookerKit()
// app._account = process.env.HBOOKER_ACCOUNT
// app._loginToken = process.env.HBOOKER_TOKEN

// User Login
await app
  .login(process.env.HBOOKER_USERNAME, process.env.HBOOKER_PASSWORD)
  .then(({ data }) =>
    console.info('[[Login]]\n', `Logged in as: ${data.reader_info.reader_name}`)
  )
  .catch((e) => console.error('[[Login]] Fail', e))

// Bookshelf List
let shelf_id = await app
  .shelfList()
  .then(({ data }) => {
    console.info(
      '[[BookShelfList]]\n',
      `You have ${data.shelf_list.length} bookshelf(s):\n`,
      data.shelf_list.map((i) => `${i.shelf_name} (#${i.shelf_id})`).join('\n')
    )
    return data.shelf_list[0].shelf_id
  })
  .catch(console.error)

// Bookshelf Details
let book_id = await app.shelf(shelf_id).then(({ data }) => {
  console.info(
    '[[BookShelf]]\n',
    `You have ${data.book_list.length} book(s) in this bookshelf:\n`,
    data.book_list
      .map(
        (i) =>
          `${i.book_info.book_name} (${i.book_info.book_id}) - ${i.book_info.author_name}`
      )
      .join('\n')
  )
  return data.book_list?.[0]?.book_info.book_id
})

// Book Details
await app
  .book(book_id)
  .then(({ data }) => {
    let b = data.book_info
    console.info(
      '[[BookInfo]]\n',
      `《${b.book_name}》 - ${b.author_name}
#${b.book_id} Words:${b.total_word_count} Favor:${b.total_favor} Click:${b.total_click}

${b.description}`
    )
  })
  .catch(console.error)

// Book Divisions
let division_id = await app
  .divisionList(book_id)
  .then(({ data }) => {
    console.info(
      '[[DivisionList]]\n',
      `This book has ${data.division_list.length} division(s):\n`,
      data.division_list
        .map(
          (i) => `${i.division_index}. ${i.division_name} (#${i.division_id})`
        )
        .join('\n')
    )
    return data.division_list?.[0]?.division_id
  })
  .catch(console.error)

// Division Characters
let chapter_id = await app
  .chapterList(division_id)
  .then(({ data }) => {
    console.info(
      '[[ChapterList]]\n',
      `This divition has ${data.chapter_list.length} chapter(s):\n`,
      data.chapter_list
        .map((i) => `${i.chapter_index}. ${i.chapter_title} (#${i.chapter_id})`)
        .join('\n')
    )
    return data.chapter_list?.[0]?.chapter_id
  })
  .catch(console.error)

// Chapter Body
await app
  .chapter(chapter_id)
  .then(({ data }) => {
    const content = data.chapter_info.txt_content
    data.chapter_info.txt_content = '...'
    console.info('[[Chapter]]\n', data.chapter_info)
    // console.info(app._decrypt(content))
    return data
  })
  .catch(console.error)
