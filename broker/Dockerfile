FROM node:18
WORKDIR /project
COPY ./ /project

ENV BROKER_UUID $BROKER_UUID
ENV JWT_SECRET $JWT_SECRET
ENV MONGODB_URL $MONGODB_URL
ENV MONGODB_USERNAME $MONGODB_USERNAME
ENV MONGODB_PASSWORD $MONGODB_PASSWORD

RUN npm install
RUN npx tsc
CMD ["node", "index.js"]
