#!/usr/bin/env bash
set -euo pipefail

echo "Building React frontend..."
cd ecommerce-ui
npm ci
npm run build
cd ..

echo "Copying frontend build into Spring Boot static resources..."
rm -rf src/main/resources/static/*
cp -R ecommerce-ui/build/* src/main/resources/static/

echo "Packaging Spring Boot application..."
sh mvnw -DskipTests package
