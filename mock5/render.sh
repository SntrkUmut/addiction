#!/bin/bash
cd /workspace/addiction-figma/mock5
for f in "$@"; do google-chrome --headless=new --no-sandbox --hide-scrollbars --force-device-scale-factor=2 --window-size=390,844 --screenshot=/workspace/addiction-figma/$f.png file:///workspace/addiction-figma/mock5/$f.html >/dev/null 2>&1; cp /workspace/addiction-figma/$f.png /tmp/v-$f-$RANDOM.png; done
ls -t /tmp/v-* | head -n $#
