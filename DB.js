const sqlite = require('sqlite')

class DB {

	constructor(dbPath) {
		this.dbPromise = sqlite.open(dbPath, { Promise })
		// .then(db => db.migrate({force: 'last'}))
		.then(db => db.migrate({migrationsPath: './migrations'}))
	}

	/**
	 * push a single record to db
	 * @param  {[type]} record [description]
	 * @return {[type]}        [description]
	 */
	push(record) {
		return this.dbPromise.then(db => db.run('INSERT INTO batch_queue(id, data) VALUES ($id, $data)', 
			{'$id': record.id, '$data': JSON.stringify(record.data)}
		))
	}

	/**
	 * get records from row 0 to row $count
	 * @param  {[type]} count [description]
	 * @return {[type]}       [description]
	 */
	get(count) {
		return this.dbPromise.then(db => db.all(`SELECT * FROM batch_queue LIMIT ${count}`))
		.then(results => {
			return results.map(result => {
				result.data = JSON.parse(result.data)
				return result
			})
		})
	}

	/**
	 * delete records of the given ids
	 * @param  {[type]} ids [description]
	 * @return {[type]}     [description]
	 */
	delete(ids) {
		return this.dbPromise.then(db => db.run(`DELETE FROM batch_queue WHERE id in (${ids})`))
	}

	/**
	 * close the db connection
	 * @return {[type]} [description]
	 */
	close() {
		return this.dbPromise.then(db => db.close())
	}
}

module.exports = DB