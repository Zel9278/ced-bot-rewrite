FROM ubuntu:focal as depender

RUN sed -i 's@archive.ubuntu.com@ftp.jaist.ac.jp/pub/Linux@g' /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y --no-install-recommends ca-certificates curl jq build-essential python3

ENV NODE_ENV="production"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir /pnpm
WORKDIR /package
COPY .npmrc package.json ./
RUN curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=$(cat package.json  | jq -r .packageManager | grep -oP '\d+\.\d+\.\d') bash -
RUN PATH="$PNPM_HOME/nodejs/$(pnpm node -v | tr -d v)/bin:$PATH" pnpm i -g node-gyp
RUN pnpm i

FROM gcr.io/distroless/cc-debian11

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
COPY --from=depender /pnpm /pnpm
COPY configs ./configs
COPY src ./src
COPY index.js ./
COPY .npmrc package.json ./
COPY --from=depender /package/node_modules ./node_modules
ENTRYPOINT [ "pnpm", "--shell-emulator" ]
CMD [ "start" ]
