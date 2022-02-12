import { startServer, initialization } from './dist/index'
import { firstLoad, pkg, job, syncLater } from './dist/allName'
initialization()
startServer(__dirname)
