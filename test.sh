#!/bin/bash

echo "---- Testing server --- "
cd target &&  node ./jasmine.js 
rc=$?
if [ $rc -ne "0"  ] 
then 
	echo Exiting with error code: $rc
	exit $rc
fi

	echo "---- starting server for frontend test  --- "
	npm start & 
	pid=$!
	echo " server PID is $pid"
	sleep 5

	echo "---- frontend test  --- "
	ng test --single-run 
	rc=$?

	kill $pid
	exit $?
