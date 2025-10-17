#!/bin/sh
set -e

echo "Starting PulcherBook Backend Services..."
echo "Mode: $SERVICES"

if [ "$SERVICES" = "all" ]; then
  echo "Starting all services in parallel..."
  pnpm start:prod:docker
else
  echo "Starting service: $SERVICES"
  # Check if service exists
  if [ ! -d "services/${SERVICES}" ]; then
    echo "Error: Service '${SERVICES}' not found in services directory"
    exit 1
  fi

  # Check if dist directory exists
  if [ ! -d "services/${SERVICES}/dist" ]; then
    echo "Error: Built files not found for service '${SERVICES}'"
    echo "Expected path: services/${SERVICES}/dist"
    exit 1
  fi

  cd "services/${SERVICES}" && pnpm start:prod:docker
fi
