#!/bin/sh

. .lg.rc

# nohup xterm -e "npm run start:watch" &

nohup xterm -e "npm run test:watch" & 

code .
