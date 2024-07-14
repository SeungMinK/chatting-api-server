# 실행 방법

## 1. 서비스 실행 (Chatting Server, Mysql, Redis, Web Server)

```
# 전체 실행 (전체 서비스를 Docker 로 실행하고싶은 경우) 
docker-compose up -d
```


```
# DB 만 실행 (서버랑 웹 별도 실행 필요)
docker-compose -f docker-compose-db.yml up -d
```


```
# WEB 서버만 실행 (서버랑 db 별도 실행 필요)
docker-compose -f docker-compose-web.yml up -d
```


<HR>

## 2. 초기 데이터 Init

- Swagger or Curl or Rest Client 을 사용하여 2-1 부터 2-3 까지 차례대로 진행

### 2-1) 유저 생성

- Swagger Docs
```
http://localhost:3000/api#/users/UserController_createUser
```
- Curl
```
# username 필드 값 변경 가능
curl -X 'POST' \
  'http://localhost:3000/users' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "testUser1"
}'
```
- Rest Client
```
"http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: { username: testUser1 },
    }
```


### 2-2) 로그인 (JWT 토큰 취득)

- Swaager Docs
```
http://localhost:3000/api#/auth/AuthController_login
```

- Crul
```
# 2-1에서 입력한 username
curl -X 'POST' \
  'http://localhost:3000/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "testUser1"
}'
```
- Rest Client
```
"http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: { username: testUser1 },
    }
```

### 2-3) 채팅방 생성

- Swagger Docs
```
http://localhost:3000/api#/chatting-rooms/ChattingRoomController_createChattingRoom
```

- Curl

```
# Authorization 값 : 2-2에서 획득한 토큰
curl -X 'POST' \
  'http://localhost:3000/chatting-rooms' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InRlc3R1c2VyMSIsImRlc2NyaXB0aW9uIjoiIiwicHJvZmlsZVVybCI6bnVsbCwiZW1haWwiOm51bGwsInJvbGUiOiJVU0VSIiwiY3JlYXRlZEF0IjoiMjAyNC0wNy0xNFQwODo1NzoyMi44MzlaIiwidXBkYXRlZEF0IjoiMjAyNC0wNy0xNFQwODo1NzoyMi44MzlaIiwiZGVsZXRlZEF0IjpudWxsLCJpYXQiOjE3MjA5NDgyMjYsImV4cCI6MTcyMDk1MTgyNn0.rLBBqLjPhenC5oO2r1oayPmrXRq1XGRRwBJbPfsBS3w' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "자기 소개서 리뷰 채팅방",
  "description": "자소서 리뷰 채팅방 설명"
}''
```

- Rest Client
```
"http://localhost:3000/chatting-rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InRlc3R1c2VyMSIsImRlc2NyaXB0aW9uIjoiIiwicHJvZmlsZVVybCI6bnVsbCwiZW1haWwiOm51bGwsInJvbGUiOiJVU0VSIiwiY3JlYXRlZEF0IjoiMjAyNC0wNy0xNFQwODo1NzoyMi44MzlaIiwidXBkYXRlZEF0IjoiMjAyNC0wNy0xNFQwODo1NzoyMi44MzlaIiwiZGVsZXRlZEF0IjpudWxsLCJpYXQiOjE3MjA5NDgyMjYsImV4cCI6MTcyMDk1MTgyNn0.rLBBqLjPhenC5oO2r1oayPmrXRq1XGRRwBJbPfsBS3w' \"
      },
      body: { username: testUser1 },
    }
```

## 3. 채팅 웹 사이트 접속

```
# Open AI  사용해서 생성
http://localhost:3000

```

<HR>

# 테스트 케이스 동작

```
# JEST 이용시 
jest --config ./apps/chatting-server/test/jest-e2e.json apps/chatting-server/test/ws/ws.service.e2e-spec.ts
```

```
# npm script 이용시
npm run test:e2e:chatting
```

<HR>

# 서비스 구성도

- 구현 기능이 많지 않고, 빠르게 구현 하기 위해 모노리틱 구조로 설계
    - 추후에 기능이 많아질 경우 MSA 구조로 전환 필요
- ERD
![chatting_ERD](https://github.com/user-attachments/assets/deb6b262-60b5-42ef-a22a-9962a0c99dab)

<HR> 

# 주요 개발 요구사항
- 실시간 채팅
- 채팅방 마지막 메시지 갱신
- 30분 내 접속자 수 기준으로 채팅 정렬
- 채팅방 진입시, 기존 대화 내역 불러오기

- [주요 개발 사항, 소켓 구현 내용 보러 가기](https://github.com/SeungMinK/chatting-api-server/issues/9)

<HR>

# 서비스 흐름도

- TBD

# 프로젝트 구현 방법

## Step.1 User 서비스 생성 및 ws-gateway Service 생성

- [user 서비스 생성](https://github.com/SeungMinK/chatting-api-server/issues/4)
- [ws-gateway 생성](https://github.com/SeungMinK/chatting-api-server/issues/5)

## Step.2 채팅방 생성 및 채팅방 Join, 메시지 실시간 소통

- [메시지 실시간 소통 작성 이슈](https://github.com/SeungMinK/chatting-api-server/issues/9)


# Step3. 테스트 케이스 작성

- [테스트 케이스 작성 이슈](https://github.com/SeungMinK/chatting-api-server/issues/11)

# Docs

- [passport]https://docs.nestjs.com/recipes/passport
- [ws gateway]https://docs.nestjs.com/websockets/gateways
- [실시간 데이터 갱신]https://nebulaisme.tistory.com/147

<HR>

# nestjs

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If
you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
