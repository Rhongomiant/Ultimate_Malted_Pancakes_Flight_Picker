# Stage 1: install production dependencies (includes the vendored @psc/https tarball).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
COPY vendor ./vendor
RUN npm install --omit=dev
COPY server.mjs ./
COPY Ultimate_Malted_Pancakes_Flight_Picker.html ./

# Stage 2: minimal runtime image.
FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/server.mjs ./
COPY --from=build /app/Ultimate_Malted_Pancakes_Flight_Picker.html ./
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.mjs"]
