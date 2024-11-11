FROM dziewan/t3-app-base:22-bullseye AS deps
ENV NODE_ENV production
ARG PORT
ENV PORT ${PORT}
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN ls -la
RUN npm install --production
RUN echo "DEPS stage DATABASE_URL=${DATABASE_URL}"

FROM dziewan/t3-app-base:22-bullseye AS builder
WORKDIR /app
RUN mkdir -p /app/backups
RUN mkdir -p /app/dump
COPY --from=deps /app/node_modules ./node_modules

# Add and extract fontawesome.tar
COPY --from=deps /usr/local/share/fontawesome.tar /tmp/fontawesome.tar
RUN ls -la /tmp && \
    mkdir -p /app/public && \
    tar -xf /tmp/fontawesome.tar -C /app/public && \
    ls -la /app/public && \
    rm /tmp/fontawesome.tar

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN ls -la
RUN echo "BUILDER stage before db operations DATABASE_URL=${DATABASE_URL}"

RUN npx prisma db push
RUN npm run db:init
RUN npm run db:update
RUN npm run build

FROM dziewan/t3-app-base:22-bullseye AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1
ENV CONTAINER docker

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/backups ./backups
COPY --from=builder --chown=nextjs:nodejs /app/dump ./dump
# COPY --from=builder --chown=nextjs:nodejs /app/backups ./backupsek
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/app ./app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /app/deployment/health-check.mjs ./health-check.mjs



# COPY --from=builder /app/scripts ./scripts
# COPY --from=builder /app/dummy.js ./dummy.js
# RUN mkdir -p /app/backups && chown -R nextjs:nodejs /app/backups
# RUN mkdir -p /dump && chown -R nextjs:nodejs /dump

VOLUME ["/app/.next/cache"]

HEALTHCHECK --interval=1m --timeout=3s --start-period=30s CMD node ./health-check.mjs


# RUN apt-get update && \
#     apt-get install -y wget gnupg && \
#     wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
#     echo "deb [arch=amd64] http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# # Instalujemy MongoDB Tools
# RUN apt-get update && \
#     apt-get install -y mongodb-org-tools
# RUN wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian10-x86_64-100.3.1.deb
# RUN dpkg -i mongodb-database-tools-debian10-x86_64-100.3.1.deb

RUN groupadd nextjs && usermod -d /app -g nextjs nextjs
USER root
RUN mkdir -p /app/.npm && chown -R nextjs:nextjs /app/.npm
# RUN mkdir -p /app/backups && chown -R nextjs:nextjs /app/backups
# RUN mkdir -p /dump && chown -R nextjs:nextjs /dump
USER nextjs

EXPOSE ${PORT}

# CMD ["sh", "-c", "npm run dummy && tail -f /dev/null"]
# CMD ["npm", "run", "dummy"]
CMD ["npm", "start"]
# ENTRYPOINT ["sh", "-c", "npm run backup && exec npm start"]
