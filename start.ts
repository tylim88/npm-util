import { startServer } from './src/index'
import { firstLoad, pck, job, syncLater } from './src/allName'
firstLoad(pck)
job('* 0 * * * *', () => syncLater(pck)).start()
startServer(__dirname)
