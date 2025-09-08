---
slug: system-design-vehicle-data-collection-and-processing
title: '시스템 디자인: 차량 데이터 수집 및 가공'
authors: ujon
date: 2025-09-08 20:45:00 +9000
tags: [ system-design ]
---

## Overview

여러 조건에서 차량 데이터를 수집하고, 수집된 데이터를 이용하여 트립<sup>trip</sup>을 생성하는 시스템을 설계해 보려고 합니다.

## 조건

1,000석 티켓을 구매하려는 100만 명의 동시 접속을 처리하는 티켓팅 플랫폼 개발

##