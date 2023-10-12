#!/bin/bash

# https://github.com/nvm-sh/nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm install 18 && nvm use 18 || exit 1
npm i -g pnpm || exit 1
mkdir ~/42Stat-Backend
