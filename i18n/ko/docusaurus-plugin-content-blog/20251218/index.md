---
slug: 20251201__project_structure__spring_boot
title: "[Project Structure] Spring Boot"
author: ujon
date: 2025-12-18
tags:
  - project-structure
---

개인 프로젝트를 진행하면서, 멀티 모듈 기반의 Spring Boot 프로젝트에서 자주 사용하는 프로젝트 구조와 정책들을 정리해 보았다.
DDD 개념을 적용한 Layered Architecture를 기반으로 설계했다.

## Project Structure

```text
{project}-server/
├── .data/
├── .docs/
├── .infra/
│   ├── database/
│   │   ├── migrations/
│   │   │   └── v0.0.1__example.sql
│   │   └── flyway.local.conf
│   ├── env/
│   │   └── .env.local
│   ├── terraform/
│   │   ├── environments/
│   │   │   └── {environment}/
│   │   │       ├── main.tf
│   │   │       └── variable.tf
│   │   └── modules/
│   └── docker-compose.yml
├── gradle
│   └── libs.versions.toml
├── {project}-api/
│   └── src/main/kotlin/{project}/api
│           ├── common/
│           ├── {path}/
│           │   ├── request/
│           │   ├── response/
│           │   ├── {path}Controller.kt
│           │   ├── {path}Facade.kt
│           │   └── {path}FacadeImpl.kt
│           └── {project}Api.kt
├── {project}-admin-api/
├── {project}-batch/
│   └── src/main/kotlin/{project}/batch
│           ├── common/
│           ├── job/
│           ├── processor/
│           ├── scheduler/
│           ├── tasklet/
│           └── {project}Batch.kt
├── {project}-core/
│   └── src/main/kotlin/{project}/core
├── {project}-domain/
│   └── src/main/kotlin/{project}/domain
│       └── {domain}/
│           ├── command/
│           ├── entity/
│           ├── exception/
│           ├── query/
│           ├── repository/
│           ├── vo/
│           ├── ${domain}Service.kt
│           └── ${domain}ServiceImpl.kt
├── Makefile
├── build.gradle.kts
├── gradle.properties
└── settings.gradle.kts
```

### .data/

Docker 기반 로컬 인프라 환경에서 볼륨 마운트용 데이터 저장소로 사용하며, 하위 파일 및 폴더는 .gitignore 처리한다.

### .docs/

프로젝트 관련 문서를 저장하는 용도로 사용하며, `howto.md`, `structure.md`, `dictionary.md`, `history.md` 등의 파일을 생성해 나중에 다시 보더라도 프로젝트를 쉽게 파악할 수 있도록 한다.

### .infra/

모든 인프라를 코드 기반으로 관리하기 위해 관련 설정들을 이 디렉토리에 저장한다.

#### database/

`migrations` 디렉토리에서 Flyway를 사용해 데이터베이스 스키마 마이그레이션을 관리한다.  
마이그레이션 파일의 이름 규칙은 Flyway 설정을 통해 별도로 정의한다.

```conf
flyway.sqlMigrationPrefix=v
flyway.sqlMigrationSeparator=__
flyway.sqlMigrationSuffixes=.sql

flyway.baselineOnMigrate=true
flyway.baselineDescription=Initial baseline
flyway.baselineVersion=0.0.0
flyway.createSchemas=true
flyway.table=flyway_schema_history
```

#### terraform/

클라우드 인프라 환경은 Terraform을 사용해 관리한다.
`environments/` 디렉토리에는 환경별 폴더를 구성하고, `main.tf`에서 사용할 모듈을 정의하며 `variables.tf`에서 필요한 변수를 선언한다.  
`modules/` 디렉토리에는 EC2, VPC, Security Group, S3 등 필요한 클라우드 서비스를 모듈 단위로 구성해 재사용한다.

#### docker-compose.yml

로컬 개발 환경에서 필요한 인프라를 빠르게 구성하고 실행할 수 있도록 Docker Compose 파일로 관리한다.

### gradle/

#### libs.versions.toml

Gradle Version Catalog를 사용해 프로젝트에서 사용하는 모든 라이브러리와 플러그인의 버전을 일관되게 관리한다.

```toml
[versions]
kotlin = "2.1.0"
spring-boot = "3.5.5"
spring-dependency-management = "1.1.7"
querydsl = "7.0"
mockk = "1.14.5"
springmockk = "4.0.2"
asciidoctor = "4.0.4"
jjwt = "0.13.0"
kotlinx-coroutines = "1.7.3"
mapstruct = "1.6.3"

[libraries]
# Spring Boot
spring-boot-starter-web = { module = "org.springframework.boot:spring-boot-starter-web", version.ref = "spring-boot" }
spring-boot-starter-batch = { module = "org.springframework.boot:spring-boot-starter-batch", version.ref = "spring-boot" }
spring-boot-starter-data-jpa = { module = "org.springframework.boot:spring-boot-starter-data-jpa", version.ref = "spring-boot" }
spring-boot-starter-mail = { module = "org.springframework.boot:spring-boot-starter-mail", version.ref = "spring-boot" }
spring-boot-starter-validation = { module = "org.springframework.boot:spring-boot-starter-validation", version.ref = "spring-boot" }
spring-boot-starter-actuator = { module = "org.springframework.boot:spring-boot-starter-actuator", version.ref = "spring-boot" }
spring-boot-starter-security = { module = "org.springframework.boot:spring-boot-starter-security", version.ref = "spring-boot" }
spring-boot-starter-test = { module = "org.springframework.boot:spring-boot-starter-test", version.ref = "spring-boot" }
spring-restdocs = { module = "org.springframework.restdocs:spring-restdocs-mockmvc", version = "3.0.5" }
spring-restdocs-asciidoctor = { module = "org.springframework.restdocs:spring-restdocs-asciidoctor", version = "3.0.5" }

# Kotlin
#kotlin-stdlib = { module = "org.jetbrains.kotlin:kotlin-stdlib", version.ref = "kotlin" }
kotlin-reflect = { module = "org.jetbrains.kotlin:kotlin-reflect", version.ref = "kotlin" }
#kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinx-coroutines" }
#kotlinx-coroutines-reactor = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-reactor", version.ref = "kotlinx-coroutines" }

# Jackson
jackson-module-kotlin = { module = "com.fasterxml.jackson.module:jackson-module-kotlin" }

# Database
postgresql = { module = "org.postgresql:postgresql", version = "42.7.7" }

# QueryDSL
querydsl-core = { module = "io.github.openfeign.querydsl:querydsl-core", version.ref = "querydsl" }
querydsl-jpa = { module = "io.github.openfeign.querydsl:querydsl-jpa", version.ref = "querydsl" }
querydsl-apt = { module = "io.github.openfeign.querydsl:querydsl-apt", version.ref = "querydsl" }

# OAuth
google-oauth = { module = "com.google.auth:google-auth-library-oauth2-http", version = "1.38.0" }
google-api-client = { module = "com.google.api-client:google-api-client", version = "2.8.1" }

# JWT
jwt-api = { module = "io.jsonwebtoken:jjwt-api", version.ref = "jjwt" }
jwt-impl = { module = "io.jsonwebtoken:jjwt-impl", version.ref = "jjwt" }
jwt-jackson = { module = "io.jsonwebtoken:jjwt-jackson", version.ref = "jjwt" }

# Mapstruct
mapstruct = { module = "org.mapstruct:mapstruct", version.ref = "mapstruct" }
mapstruct-processor = { module = "org.mapstruct:mapstruct-processor", version.ref = "mapstruct" }

# ETC
uuid = { module = "com.fasterxml.uuid:java-uuid-generator", version = "5.1.0" }

# Test
kotlin-test-junit5 = { module = "org.jetbrains.kotlin:kotlin-test-junit5" }
mockk = { module = "io.mockk:mockk", version.ref = "mockk" }
springmockk = { module = "com.ninja-squad:springmockk", version.ref = "springmockk" }
junit-platform-launcher = { module = "org.junit.platform:junit-platform-launcher" }

[bundles]
spring-web = ["spring-boot-starter-web", "spring-boot-starter-validation", "jackson-module-kotlin"]
spring-batch = ["spring-boot-starter-batch"]
spring-security = ["spring-boot-starter-security"]
health-check = ["spring-boot-starter-actuator"]
kotlin-base = ["kotlin-reflect"]
test = ["spring-boot-starter-test", "kotlin-test-junit5", "mockk", "springmockk"]
infra-rdbms = ["spring-boot-starter-data-jpa", "querydsl-core", "querydsl-jpa"]
jwt-runtime = ["jwt-impl", "jwt-jackson"]

[plugins]
kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }
kotlin-spring = { id = "org.jetbrains.kotlin.plugin.spring", version.ref = "kotlin" }
kotlin-jpa = { id = "org.jetbrains.kotlin.plugin.jpa", version.ref = "kotlin" }
kotlin-kapt = { id = "org.jetbrains.kotlin.kapt", version.ref = "kotlin" }
spring-boot = { id = "org.springframework.boot", version.ref = "spring-boot" }
spring-dependency-management = { id = "io.spring.dependency-management", version.ref = "spring-dependency-management" }
asciidoctor-jvm-convert = { id = "org.asciidoctor.jvm.convert", version.ref = "asciidoctor" }
```

### \{project}-api/

이전에는 Presentation Layer(Controller)와 Application Layer(Facade)를 분리된 패키지로 관리하고, 각 레이어마다 별도의 DTO를 정의한 뒤 매핑하는 방식으로 프로젝트 구조를 구성했다.

그러나 개발을 진행할수록 레이어 간 중복된 DTO와 매핑 코드가 과도하게 늘어나는 문제를 경험했다. Controller와 Facade가 거의 동일한 데이터를 다루는 경우가 많아 기존 프로젝트 구조의 단점이라고 생각했다.

그래서, 현재는 Controller와 Facade가 Request / Response DTO를 공유하는 방식으로 프로젝트 구조를 단순화했다.

```text
# 과거
{project}-api/
└── src/main/kotlin/{project}/api
        ├── controller/
        │   └── {path}/
        │       ├── request/
        │       └── response/
        └── facade/
            └── {path}/
                ├── input/
                └── output/
# 현재
{project}-api/
└── src/main/kotlin/{project}/api
        └── {path}/
            ├── request/
            └── response/
```

#### common

Filter, ExceptionHandler, DTO, Properties 등 여러 모듈에서 공통으로 사용하는 컴포넌트와 객체들을 관리한다.

#### Mapping

과거 Java Spring Boot 프로젝트에서는 레이어별로 Mapper 클래스를 분리하고, MapStruct를 사용해 DTO 간 매핑을 처리했다.  
그러나 Kotlin Spring Boot로 전환한 이후, MapStruct는 매핑 관계가 직관적으로 드러나지 않거나 컴파일, 런타임 오류를 유발하는 경우가 잦아 사용성이 명확하지 않다고 느꼈다.

현재는 Kotlin의 **Extension Function**을 활용해 DTO 매핑을 처리하고 있으며, 해당 함수는 외부에서 사용되지 않도록 `private`으로 선언해 관리한다.  
매핑 함수의 네이밍은 `to{변환할 DTO 이름}` 형식을 따르도록 정책을 정했다.

```kotlin
// MARK: - example
private fun CreateUserRequest.toCreateUserCommand() = CreateUserCommand(
    email = this.email,
    name = this.name,
)
```

### \{project}-batch/

`common`을 제외한 모든 패키지는 폴더이름에 맞게 컴포넌트를 생성하여 관리한다.

#### common/

공통 Job 설정과 Listener 설정 등을 이곳에 위치시킨다.

### \{project}-domain/

과거에는 infra 모듈을 별도로 두고, 그 하위에 rdbms, redis, mongodb와 같이 인프라 유형별 모듈을 구성한 뒤 이를 domain 모듈에서 implement하는 방식으로 사용했다.

그러나 도메인 모듈을 명확히 분리하지 않은 상태에서는 이러한 구조가 실질적인 이점보다 복잡성만 증가시킨다고 판단했고, 이에 따라 현재는 서비스 규모가 충분히 커지는 시점에 인프라 모듈을 분리하는 것을 전제로 하고, 그 이전 단계에서는 domain 모듈에서 인프라 관련 설정까지 함께 관리하도록 구성했다.

command, query 패키지는 각각 데이터 변경과 조회를 위한 DTO를 관리하며,
파일명은 `{name}Command.kt`, `{name}Query.kt` 형식의 네이밍 규칙을 따른다.

entity 패키지에는 데이터베이스에 저장되는 엔티티를 정의하고,
vo 패키지에는 엔티티에서 사용하는 enum과 값 객체(Value Object)들을 관리하도록 구성했다.

### Makefile

Docker 기반 로컬 인프라 실행 및 중지, Flyway 스키마 마이그레이션 등 프로젝트에서 반복적으로 사용하는 명령어들을 정리해 관리한다.

```Makefile
# Environment Variables
include .env
export

# Get absolute project path
PROJECT_ROOT := $(shell pwd)
INFRA_PATH := $(PROJECT_ROOT)/.infra
DATABASE_PATH := $(PROJECT_ROOT)/.infra/database
MIGRATIONS_PATH := $(DATABASE_PATH)/migrations
VOLUME_PATH := $(PROJECT_ROOT)/.data

# Environment file selection
ENV ?= local
ENV_FILE := $(PROJECT_ROOT)/.infra/env/.env.$(ENV)

# Load environment-specific file if exists
ifneq (,$(wildcard $(ENV_FILE)))
	include $(ENV_FILE)
	export
endif

.PHONY: help env-* flyway-* container-*

help: ## Show this help message
	@echo "🔧 Available Commands:"
	@echo "====================="
	@awk 'BEGIN {FS = ":.*?## "; printf "\n"} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "📝 Usage Examples:"
	@echo "  make help                    # Show this help"
	@echo "  make env-show               # Show current environment"
	@echo "  make container-up           # Start services"
	@echo "  make ENV=prod container-up  # Start services with production config"
	@echo ""
	@echo "🌍 Available Environments:"
	@echo "  local (default), dev, prod"


env-show: ## Show current environment variables
	@echo "📋 Current Environment Variables:"
	@echo "================================="
	@echo "Environment: $(ENV)"
	@echo "Project Root: $(PROJECT_ROOT)"
	@echo "DB Host: $(DB_HOST)"
	@echo "DB Name: $(DB_NAME)"
	@echo "Migrations Path: $(MIGRATIONS_PATH)"
	@echo "Database Path Path: $(DATABASE_PATH)"
	@echo "Volume Path: $(VOLUME_PATH)"

env-validate: ## Validate required environment variables
	@echo "🔍 Validating environment variables..."
	@test -n "$(DB_HOST)" || (echo "❌ DB_HOST not set" && exit 1)
	@test -n "$(DB_NAME)" || (echo "❌ DB_NAME not set" && exit 1)
	@test -n "$(DB_USERNAME)" || (echo "❌ DB_USERNAME not set" && exit 1)
	@test -n "$(DB_PASSWORD)" || (echo "❌ DB_PASSWORD not set" && exit 1)
	@test -d "$(MIGRATIONS_PATH)" || (echo "❌ Migrations directory not found: $(MIGRATIONS_PATH)" && exit 1)
	@test -d "$(DATABASE_PATH)" || (echo "❌ Database directory not found: $(DATABASE_PATH)" && exit 1)
	@test -d "$(VOLUME_PATH)" || (echo "❌ Volume path not found: $(VOLUME_PATH)" && exit 1)
	@echo "✅ All required variables are set!"

volume-init: ## Initialize volume directories
	@mkdir $(VOLUME_PATH)
	@mkdir $(VOLUME_PATH)/postgresql
	@mkdir $(VOLUME_PATH)/redis
	@echo "✅ Volume directories created!"


# Container runtime detection and variables
CONTAINER_RUNTIME ?= $(shell which podman >/dev/null && echo podman || echo docker)

# Container up
container-up: ## Start services with container runtime
	@echo "🐳 Starting services with $(CONTAINER_RUNTIME) ($(ENV))..."
	@$(CONTAINER_RUNTIME) compose \
		--env-file $(ENV_FILE) \
		-f $(INFRA_PATH)/docker-compose.yml \
		-p $(PROJECT) \
		up -d

# Container down
container-down: ## Stop all services
	@echo "🛑 Stopping services with $(CONTAINER_RUNTIME) ($(ENV))..."
	@$(CONTAINER_RUNTIME) compose \
		-f $(INFRA_PATH)/docker-compose.yml \
		-p $(PROJECT) \
		down

container-clean: ## Clean volumes and reinitialize
	@rm -rf $(VOLUME_PATH)
	@$(MAKE) volume-init
	@echo "✅ Volumes cleaned and reinitialized!"

flyway-migrate: ## Run database migrations
	@echo $(DATABASE_PATH)/flyway.local.conf
	@$(CONTAINER_RUNTIME) run --rm \
    		--network host \
    		-v $(MIGRATIONS_PATH):/flyway/sql \
    		-v $(DATABASE_PATH)/flyway.$(ENV).conf:/flyway/conf/flyway.conf \
    		-e FLYWAY_URL="$(FLYWAY_URL)" \
            -e FLYWAY_USER="$(FLYWAY_USER)" \
            -e FLYWAY_PASSWORD="$(FLYWAY_PASSWORD)" \
    		-e FLYWAY_SCHEMAS="$(PROJECT)" \
    		-e FLYWAY_LOCATION="$(MIGRATIONS_PATH)" \
    		flyway/flyway:11.11.2 \
    		migrate
	@echo "✅ Database migrations completed!"
```
