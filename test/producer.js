const BatchQueue = require('../BatchQueue')

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