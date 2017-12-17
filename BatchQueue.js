const DB = require('./db')
const uniqid = require('uniqid')
const schedule = require('node-schedule')

class BatchQueue {

	constructor(dbPath) {
		this.path = dbPath
	}

	/**
	 * add an array of items to the end of the queue
	 * @param  {[type]} batch [description]
	 * @return {[type]}       [description]
	 */
	push(batch) {
		const db = new DB(this.path)
		return batch.reduce((acc, entry) => {
			return acc.then(() => db.push(
				{
					id: uniqid(),
					data: entry
				}
			))
		}, Promise.resolve())
		.then(() => {
			db.close().then(() =>  "done")
		})
	}

	/**
	 * Executes the given asyncJob on the items from 0-to-count
	 * then deletes those items from the queue and return prmoise that
	 * resolves to the poped items
	 * @param  {[type]} count    [description]
	 * @param  {[type]} asyncJob [description]
	 * @return {[type]}          [description]
	 */
	pop(count, asyncJob) {
		const db = new DB(this.path)
		return db.get(count)
		.then(results => {
			// execute the batch job on the results
			return asyncJob(results)
			.then(() => {
				return results
			})
		})
		.then(results => {
			let ids = results.reduce((acc, result, index) => {
				return acc += '"' + result.id + '"' + ( index < results.length - 1 ? ', ' : '')
			} , '')
			return db.delete(ids).then(() => results)
		})
		.then(results => {
			return db.close().then(() => results)
		})
		.catch(err => {
			return db.close().then(() => {
				throw err
			})
		})
	}

	/**
	 * Schedule a given job (asyncJob) to run every given number of
	 * mintues on a batch of items defined by (forBatchCount) 
	 * that is poped from the queue if the asyncJob succeeds
	 * @param  {[type]} asyncJob      [description]
	 * @param  {[type]} forBatchCount [description]
	 * @param  {[type]} everyMins     [description]
	 * @param  {[type]} onSuccess     [description]
	 * @param  {[type]} onFail        [description]
	 * @return {[type]}               [description]
	 */
	schedule(asyncJob, forBatchCount, everyMins, onSuccess, onFail) {
		schedule.scheduleJob(`*/${everyMins} * * * *`, () => {
			this.pop(forBatchCount, asyncJob)
			.then(results => {
				onSuccess(results)
			})
			.catch(err => {
				console.log(err)
				onFail(err)
			})
		})
	}

}

module.exports = BatchQueue