---
slug: 20251201__project_structure__spring_boot
title: "[Project Structure] Spring Boot"
author: ujon
date: 2025-12-18
tags:
  - project-structure
---

While working on personal projects, I have organized the project structure and architectural conventions that I frequently use in multi-module Spring Boot projects.
This structure is designed based on a Layered Architecture inspired by Domain-Driven Design(DDD) concepts.

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
├── infra/
├── Makefile
├── build.gradle.kts
├── gradle.properties
└── settings.gradle.kts
```

### .data/

Used as a volume-mounted data directory for Docker-based local infrastructure.
All files and subdirectories are excluded from version control via .gitignore.

### .docs/

Stores project-related documentation.
Files such as `howto.md`, `structure.md`, `dictionary.md`, and `history.md` are created to ensure that the project can be easily understood even after some time has passed.

### .infra/

This directory contains all configurations required to manage infrastructure as code.

#### database/

Database schema migrations are managed using Flyway under the `migrations` directory.
Migration file naming conventions are defined through Flyway configuration.

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

Cloud infrastructure is managed using Terraform.
The `environments/` directory contains environment-specific configurations, where `main.tf` defines the modules to be used and `variables.tf` declares required variables.

Reusable cloud service modules such as EC2, VPC, Security Group, and S3 are defined under the modules/ directory.

#### docker-compose.yml

Managed using Docker Compose to quickly provision and run required infrastructure in the local development environment.

### gradle/

#### libs.versions.toml

Uses Gradle Version Catalog to centrally manage versions of all libraries and plugins used across the project.

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

Previously, the Presentation Layer (Controller) and Application Layer (Facade) were managed in separate packages, each defining its own DTOs and mapping logic.

However, as development progressed, I observed that this approach introduced excessive duplication of DTOs and mapping code.
In many cases, Controllers and Facades handled nearly identical request and response data, making the structure costly to maintain.

As a result, the current structure simplifies this by allowing Controllers and Facades to share Request and Response DTOs.

```text
# Previous
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
# Current
{project}-api/
└── src/main/kotlin/{project}/api
        └── {path}/
            ├── request/
            └── response/
```

#### common

Manages components and objects shared across multiple modules, such as Filters, Exception Handlers, DTOs, and configuration properties.

#### Mapping

In earlier Java-based Spring Boot projects, DTO mappings were handled using MapStruct with separate Mapper classes for each layer.
After transitioning to Kotlin Spring Boot, MapStruct often caused unclear mapping relationships and frequent compile-time or runtime errors, reducing its overall usability.

Currently, DTO mapping is handled using Kotlin extension functions, which are declared as `private` to limit their scope.
The naming convention for mapping functions follows the pattern `to{TargetDtoName}`.

```kotlin
// MARK: - example
private fun CreateUserRequest.toCreateUserCommand() = CreateUserCommand(
    email = this.email,
    name = this.name,
)
```

### \{project}-batch/

All packages, except common, define components strictly according to their directory name and responsibility.

#### common/

Contains shared Job configurations and Listener configurations used across batch jobs.

### \{project}-domain/

Previously, infrastructure modules (e.g., rdbms, redis, mongodb) were separated under an infra module and implemented by the domain module.

However, without a fully separated domain boundary, this approach increased complexity without providing sufficient benefits.
Therefore, the current design keeps infrastructure-related configurations within the domain module, with the intention of extracting them into separate modules once the service grows in size.

The `command` and `query` packages store DTOs for data mutation and data retrieval, respectively.
File naming follows the conventions `{name}Command.kt` and `{name}Query.kt`.

The entity package contains database entities, while the `vo` package stores enums and Value Objects used within entities.

### Makefile

Centralizes frequently used commands such as starting and stopping Docker-based local infrastructure and executing Flyway schema migrations.

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
