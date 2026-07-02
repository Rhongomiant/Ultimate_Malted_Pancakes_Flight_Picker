# Stage 1: install production dependencies (includes the vendored @psc/https tarball).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
COPY vendor ./vendor
RUN npm install --omit=dev

# Stage 2: minimal runtime image. `COPY . .` brings server.mjs plus the app's
# static assets; .dockerignore keeps node_modules, tests, and docs out of the
# build context, so the installed node_modules layer survives untouched.
FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.mjs"]
