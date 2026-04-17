# Render Deployment

This project is prepared to run on Render as a single Spring Boot web service that serves the built React app.

## Recommended setup

1. Create a PostgreSQL database in Render.
2. Create one Web Service from this repository.
3. Set the service root directory to `demo`.
4. Choose `Docker` as the language/runtime.

## Docker settings

- Root Directory: `demo`
- Dockerfile Path: `./Dockerfile`

You do not need a separate build command or start command when using the Docker runtime. Render will build and run the image from the Dockerfile.

## Environment variables

Set these in the Render dashboard:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Optional:

- `SPRING_JPA_HIBERNATE_DDL_AUTO=update`
- `SPRING_H2_CONSOLE_ENABLED=false`

## Notes

- `server.port` already reads Render's `PORT` variable.
- The React frontend uses same-origin API calls, so Spring Boot serves both the UI and API from the same service.
- Local development still falls back to the in-memory H2 database if Render database variables are not set.
