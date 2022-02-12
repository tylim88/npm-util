import { startServer } from './src/index'
import { firstLoad, pkg, job, syncLater } from './src/allName'
firstLoad(pkg)
job('* 0 * * * *', () => syncLater(pkg), true).start()
startServer(__dirname)
