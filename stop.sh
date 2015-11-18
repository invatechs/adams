#!/bin/bash
kill `ps -ef | grep ./adams.js | grep -v grep | awk '{ print $2 }'`