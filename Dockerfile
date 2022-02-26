# pull base image
FROM node:16.14.0

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ENV REACT_NATIVE_PACKAGER_HOSTNAME=192.168.2.49
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=127.0.0.1

# default to port 19006 for node, and 19001 and 19002 (tests) for debug
ARG PORT=19006
ENV PORT $PORT
EXPOSE $PORT 19001 19002

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm -g npm@latest expo-cli@latest

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /home/node/codesom_app && chmod -R 777 /home/node/codesom_app
WORKDIR /home/node/codesom_app
ENV PATH /home/node/codesom_app/.bin:$PATH
USER node
COPY --chown=node ./package.json ./package-lock.json ./
RUN npm install

# copy in our source code last, as it changes the most
# WORKDIR /opt/codesom_app
# for development, we bind mount volumes; comment out for production
# COPY ./codesom_app .


CMD ["expo","start"]
# ENTRYPOINT ["npm", "run"]
#CMD ["start"]
# docker run -it --rm -p 19000:19000 -p 19001:19001 -p 19002:19002 -v "$PWD:/home/node/codesom_app" \
# -e REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.101 \
# -e EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 \
# --name=codesom codesom_app