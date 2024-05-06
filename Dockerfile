# version should match the playwright version from package.json
FROM mcr.microsoft.com/playwright:v1.43.0-jammy
RUN mkdir /app
WORKDIR /app
COPY . /app/

# install dependencies
RUN npm install --force
# Install applications like chromium etc
RUN npx playwright install
