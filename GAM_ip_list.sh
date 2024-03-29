#!/bin/bash

# https://cloud.google.com/compute/docs/faq#find_ip_range
# nslookup -q=TXT _cloud-netblocks.googleusercontent.com  8.8.8.8

myarray=()
for LINE in `dig txt _cloud-netblocks.googleusercontent.com +short | tr " " "\n" | grep include | cut -f 2 -d :`
do
	myarray+=($LINE)
	for LINE2 in `dig txt $LINE +short | tr " " "\n" | grep include | cut -f 2 -d :`
	do
		myarray+=($LINE2)
	done
done

for LINE in ${myarray[@]}
do
	dig txt $LINE +short | tr " " "\n"
done | grep ip4 | cut -f 2 -d : | sort -n +0 +1 +2 +3 -t .

# changing target to _spf.google.com, you can get a simliar range now for Google Apps mail servers.
# https://support.google.com/a/answer/60764

# changing it to _netblocks.google.com will help get all the ip ranges google uses for its services.
