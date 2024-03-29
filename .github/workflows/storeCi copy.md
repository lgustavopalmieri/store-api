name: storeCi
on:
  push:
    branches:
      - master
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  check-application:
    runs-on: ubuntu-latest 

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Use Node.js
        uses: actions/setup-node@v2 
        with:
          node-version: "16.x"

      - name: Install dependencies
        run: npm ci -f

      - name: Tests
        run: npm test  

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} 
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      # - name: Set up QEMU
      #   uses: docker/setup-qemu-action@v1

      # - name: Set up Docker Buildx
      #   uses: docker/setup-buildx-action@v1

      # - name: Login to DockerHub
      #   uses: docker/login-action@v2
      #   with:
      #     username: ${{ secrets.DOCKERHUB_USERNAME }}
      #     password: ${{ secrets.DOCKERHUB_TOKEN }}

      # - name: Build and push
      #   id: docker_build
      #   uses: docker/build-push-action@v3
      #   with:
      #     push: true
      #     tags: lgustavopalmieri/nest:latest
