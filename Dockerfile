FROM ubuntu:16.04

# Install node 10 and npm
RUN apt-get update
RUN apt-get install curl sudo ssh -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN apt-get install nodejs -y
RUN node -v && npm -v

# Install OpenJDK-8
RUN apt-get update && \
  apt-get install -y openjdk-8-jdk && \
  apt-get install -y ant && \
  apt-get clean;

# Fix certificate issues
RUN apt-get update && \
  apt-get install ca-certificates-java && \
  apt-get clean && \
  update-ca-certificates -f;

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME

ARG api_port
ARG dynamo_port

ENV API_PORT=$api_port
ENV DYNAMO_PORT=$dynamo_port

WORKDIR /app

COPY . ./

RUN npm i -g yarn
RUN yarn
RUN yarn serverless dynamodb install > /dev/null 2>&1

CMD [ "yarn", "serverless", "offline", "start" ]

EXPOSE $api_port
EXPOSE $dynamo_port

ENV AWS_ACCESS_KEY_ID=abc
ENV AWS_SECRET_ACCESS_KEY=xyz
ENV AWS_DEFAULT_REGION=eu-west-1
