const BatchQueue = require('../BatchQueue')

const queue = new BatchQueue('./database.sqlite')

queue.schedule(heavyDutyJob, 5, 1, (results) => {
	console.log(results)
}, (err) => {
	console.log(err)
})

// queue.pop(100, heavyDutyJob)
// .then(items => {
// 	console.log(items)
// })


function heavyDutyJob(results) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			results.forEach((entry) => {
				console.log(entry.data)
			})
			resolve("done")
		}, 2000)

	})

}