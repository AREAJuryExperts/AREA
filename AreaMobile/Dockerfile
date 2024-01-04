FROM beevelop/android-nodejs:v2023.10.1 as build
WORKDIR /app
ARG EAS_CRED
ENV PATH /app/node_modules/.bin:$PATH
ENV EXPO_TOKEN=${EAS_CRED}
ENV EAS_NO_VCS=1
COPY package.json ./
RUN npm install -g npm@10.2.5
RUN npm i
RUN npx expo install expo-checkbox
RUN npm install -g eas-cli
RUN yes | sdkmanager --update
COPY . ./
RUN rm client.apk || true
RUN eas build --platform android --local --non-interactive --profile preview
RUN mv *.apk client.apk
RUN mkdir build
RUN mv client.apk build/client.apk

FROM beevelop/android-nodejs:v2023.10.1
WORKDIR /app
COPY --from=build /app/ /app
CMD (cp /app/build/client.apk /mobile || true)
