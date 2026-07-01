#!/bin/sh

DIR="/etc"

FILE=$(fgrep -Rl datadir "$DIR")
if [ -n "$FILE" ]
then
    # mkdir /data/mysql
    echo " "
    echo "Updating $FILE"
    echo " "
    sed -i -e '/^datadir/s/\/var\/lib\//\/data\//' $FILE
    fgrep -R datadir "$DIR"
else
    echo " "
    echo "file not found"
    echo " "
fi

