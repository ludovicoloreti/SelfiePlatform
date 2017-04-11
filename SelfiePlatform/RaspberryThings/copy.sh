#!/usr/bin/expect -f

# connect via scp
spawn rsync -avz pi@raspberrypi.local:/home/pi/SelfiePlatform/client/images/ /Users/..../.../
#######################
expect {
  -re ".*sword.*" {
    exp_send "raspberry\r"
  }
}
interact
