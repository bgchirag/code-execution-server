FROM node:20

# Install g++ and Python
RUN apt update && apt install -y build-essential python3

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "start"]
