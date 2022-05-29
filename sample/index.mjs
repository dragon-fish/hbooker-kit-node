import 'dotenv/config'
import { HBookerKit } from '../lib/index.js'

const app = new HBookerKit()
// app._account = process.env.HBOOKER_ACCOUNT
// app._loginToken = process.env.HBOOKER_TOKEN

// User Login
await app
  .login(process.env.HBOOKER_USERNAME, process.env.HBOOKER_PASSWORD)
  .then(({ data }) =>
    console.info(
      '[Login]',
      `Logged in as: ${data.reader_info.reader_name}`,
      data
    )
  )
  .catch((e) => console.error('[Login] Fail', e))

// Bookshelf List
let shelf_id = await app
  .shelfList()
  .then(({ data }) => {
    console.info(
      '[BookShelfList]',
      `You have ${data.shelf_list.length} bookshelf(s):`,
      data.shelf_list.map((i) => `${i.shelf_name} (${i.shelf_id})`)
    )
    return data.shelf_list[0].shelf_id
  })
  .catch(console.error)

// Bookshelf Details
let book_id = await app.shelf(shelf_id).then(({ data }) => {
  console.info(
    '[BookShelf]',
    `You have ${data.book_list.length} book(s) in this bookshelf:`,
    data.book_list.map(
      (i) =>
        `${i.book_info.book_name} (${i.book_info.book_id}) - ${i.book_info.author_name}`
    )
  )
  return data.book_list?.[0]?.book_info.book_id
})

// Book Details
app
  .book(book_id)
  .then(({ data }) => console.info('[BookInfo]', data.book_info))
  .catch(console.error)
