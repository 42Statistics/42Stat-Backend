#!/bin/sh

if [ "$PROD" = "prod" ]; then
  pnpm i && pnpm run start:prod
else
  pnpm i && pnpm run start:dev
fi
