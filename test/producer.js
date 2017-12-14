const BatchQueue = require('../BatchQueue')
const uniqid = require('uniqid')


const queue = new BatchQueue('./database.sqlite')

const batch = [
	{id: uniqid(), data: {udid: '1', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '2', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '3', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '4', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '5', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '6', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '7', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '8', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '9', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '10', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '11', timestamp: Date.now()}},
	{id: uniqid(), data: {udid: '12', timestamp: Date.now()}}
]

queue.push(batch)