import 'dotenv/config'
import { HBookerKit } from '../src/index.mjs'

const app = new HBookerKit()
await app.login(process.env.HBOOKER_USERNAME, process.env.HBOOKER_PASSWORD)
app.book(100319111).then(console.info)
