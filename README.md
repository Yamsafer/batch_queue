# batch_queue
A queue for pushing tasks and then executing them in batches when needed. This is mostly helpful for cases where you want to accumulate items in one process and act on them in batches in a different process. For example, let's say you want to accumulate records that you want to later insert them in batches into a DB to reduce traffic/cost/...  

## PUSH
```javascript
const BatchQueue = require('batch_queue')
const queue = new BatchQueue('./database.sqlite')
const batch = [
	{udid: '1', timestamp: Date.now()},
	{udid: '2', timestamp: Date.now()},
	{udid: '3', timestamp: Date.now()},
	{udid: '4', timestamp: Date.now()},
	{udid: '5', timestamp: Date.now()},
	{udid: '6', timestamp: Date.now()},
	{udid: '7', timestamp: Date.now()},
	{udid: '8', timestamp: Date.now()},
	{udid: '9', timestamp: Date.now()},
	{udid: '10', timestamp: Date.now()},
	{udid: '11', timestamp: Date.now()},
	{udid: '12', timestamp: Date.now()}
]

queue.push(batch)
```

## POP
```javascript
const BatchQueue = require('batch_queue')
const queue = new BatchQueue('./database.sqlite')

 queue.pop(100, heavyDutyJob)
 .then(items => {
 	console.log(items)
 })

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
```

## SCHEDULE
```javascript
const BatchQueue = require('batch_queue')
const queue = new BatchQueue('./database.sqlite')

queue.schedule(heavyDutyJob, 5, 1, (results) => {
	console.log(results)
}, (err) => {
	console.log(err)
})

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
```