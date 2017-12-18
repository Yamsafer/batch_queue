const queue = require('../BatchQueue').getSharedInstance('./database.sqlite')

queue.schedule(heavyDutyJob, 10, 1, (results) => {
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
				console.log(entry)
			})
			resolve("done")
		}, 2000)

	})

}