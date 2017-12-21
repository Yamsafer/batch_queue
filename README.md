# batch_queue
A queue for pushing tasks and then executing them in batches when needed. This is mostly helpful for cases where you want to accumulate items in one process and act on them in batches in a different process. For example, let's say you want to accumulate records that you want to later insert them in batches into a DB to reduce traffic/cost/... 

## Simplest SQLite Queue
* Persistent (SQLite) 
* Batch processing
* Shared connection to sqlite file
* Pushing bulk of items or single item at a time
* Poping items as needed
* FIFO
* Promises
* Built-in cron like scheduling

### Install (via npm)
`npm install --save batch_queue`

### Example
```javascript
const queue = require('batch_queue').getSharedConnection('./database.sqlite')
queue.push([{
	id: '12345'
	name: 'taweel',
	sent_at: Date.now()
}]
// schedule the queue to pop 5 items every 1 minute and perform some task on them
queue.schedule((data) => {
	//asyncJob
	return new Promise((resolve, reject) => {
		data.forEach(item => {
			console.log(item)
		})
		resolve("done")
	}
}, 5, 1, (results) => {
	// onSuccess
	console.log(results)
}, (err) => {
	// onFail
	console.log(err)
})
```

## PUSH
`push(batch)` pushes an array of items to the queue. returns a promise that resolves to `'done'` if the push was successful
```javascript
const queue = require('batch_queue').getSharedConnection('./database.sqlite')
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
.then(result => {
	console.log(result)
})
```

## POP
`pop(count, asyncJob)` Executes the given asyncJob on the items from 0-to-count, if the asyncJob was successful it
then deletes those items from the queue and return prmoise that resolves to the poped items
```javascript
const queue = require('batch_queue').getSharedConnection('./database.sqlite')

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
`schedule(asyncJob, forBatchCount, everyMins, onSuccess, onFail)` Schedule a given job (asyncJob) to run every given number of
mintues on a batch of items defined by (forBatchCount) that will be poped from the queue, those items are deleted
only if the asyncJob succeeds. onSuccess will be called after completion with the list of poped items, onFail will be called
whenever an error occuers, the error given as arguemnt
```javascript
const queue = require('batch_queue').getSharedConnection('./database.sqlite')

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