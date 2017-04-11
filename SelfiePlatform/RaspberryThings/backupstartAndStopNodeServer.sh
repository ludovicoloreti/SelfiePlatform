#!/bin/bash
# /etc/init.d/selfie

### BEGIN INIT INFO
# Provides:          selfieplatform
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Example initscript
# Description:       This service is used to manage selfieplatform
### END INIT INFO


case "$1" in
  start)
  echo "Starting selfie"
  cd /home/pi/SelfiePlatform && /home/pi/.nvm/versions/node/v6.2.2/bin/node server.jss
  ;;
  restart)
  echo "Restarting selfie"
  cd /home/pi/SelfiePlatform && sudo kill -9 $(ps aux | grep '\snode\s' | awk '{print $2}') && /home/pi/.nvm/versions/node/v6.2.2/bin/node server.jss
  ;;
  stop)
  echo "Stopping selfie"
  cd /home/pi/SelfiePlatform && sudo kill -9 $(ps aux | grep '\snode\s' | awk '{print $2}')
  ;;
  *)
  echo "Usage: /etc/init.d/selfie start|stop|restart"
  exit 1
  ;;
esac

exit 0
