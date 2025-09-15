# Step 1: build frontend
FROM node:22-alpine AS build
WORKDIR /app

COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN cd frontend && npm install
RUN cd backend && npm install 

# copy backend source for type information
COPY frontend ./frontend
COPY backend ./backend

RUN cd frontend && npm run build
RUN cd backend && npm run build

# Stage 2: Build backend image
FROM node:22-alpine
WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --production


# Copy frontend build output into backend's public folder
COPY --from=build /app/backend/ ./backend
COPY --from=build /app/frontend/dist ./backend/public


EXPOSE 8008
CMD ["sh", "-c", "cd backend && npm run db:push && npm start"]