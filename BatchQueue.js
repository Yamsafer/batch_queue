const DB = require('./DB')
const uniqid = require('uniqid')
const schedule = require('node-schedule')
let connections = {}

class BatchQueue {

	constructor(dbPath) {
		this.db = new DB(dbPath)
	}

	static getSharedConnection(dbPath) {
		let queue = connections[dbPath]
		if (!queue) {
			queue = new BatchQueue(dbPath)
			connections[dbPath] = queue
		}
		return queue
	}
	/**
	 * add an array of items to the end of the queue
	 * @param  {[type]} batch [description]
	 * @return {[type]}       [description]
	 */
	push(batch) {
		return batch.reduce((acc, entry) => {
			return acc.then(() => this.db.push(
				{
					id: uniqid(),
					data: entry
				}
			))
		}, Promise.resolve())
		.then(() => {
			return "done"
		})
	}

	/**
	 * Executes the given asyncJob on the items from 0-to-count, if the asyncJob was successful it
	 * then deletes those items from the queue and return prmoise that
	 * resolves to the poped items
	 * @param  {[type]} count    [description]
	 * @param  {[type]} asyncJob [description]
	 * @return {[type]}          [description]
	 */
	pop(count, asyncJob) {
		return this.db.get(count)
		.then(results => {
			// execute the batch job on the data
			return asyncJob(results.map(entry => entry.data))
			.then(() => {
				return results
			})
		})
		.then(results => {
			let ids = results.reduce((acc, result, index) => {
				return acc += '"' + result.id + '"' + ( index < results.length - 1 ? ', ' : '')
			} , '')
			return this.db.delete(ids).then(() => results)
		})
		.then(results => {
			return results
		})
	}

	/**
	 * Schedule a given job (asyncJob) to run every given number of
	 * mintues on a batch of items defined by (forBatchCount) 
	 * that is poped from the queue. , those items are deleted only if the asyncJob succeeds.
	 * onSuccess will be called after completion with the list of poped items.
	 * onFail will be called whenever an error occuers, the error given as arguemnt
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