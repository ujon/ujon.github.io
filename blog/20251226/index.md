---
slug: 20251226__qr_order
title: "[System Design] QR Order"
author: ujon
date: 2025-12-26
tags:
  - system-design
---

## Overview

During a trip to the US, I had a great experience using a QR code ordering and payment system at a restaurant. Recently, I encountered the same system at a restaurant in Korea during lunch and decided to design it myself.

## Requirements

- Customers can place orders by scanning a QR code
- Each table has a unique QR code
- Multiple customers at the same table can share a cart in real-time and order together
- The kitchen can immediately view completed orders
- Orders cannot be placed from outside the restaurant

## System Design

![system design](/asset/image/20251226_qr_order.png)

### Websocket Server

Handles real-time communication and runs as a separate instance from the Client API and Admin API for load distribution.

**Key Features**

- Real-time cart synchronization between customers at the same table
- Order notifications to kitchen devices

**Implementation**

- Cart Synchronization
  - Uses Redis Pub/Sub to manage channels and support horizontal scaling.
  - Pub/Sub does not persist messages, which means there is a possibility of message loss. However, since cart data is ephemeral and can be re-synced during order confirmation, Streams is not used.
- Order Processing
  - Uses Redis Streams to ensure orders are reliably delivered to the kitchen.
  - Implements Consumer Groups to enable reprocessing in case of failures.

### Client API

Provides APIs for customers.

**Key Features**

- Menu listing
- Order submission

**Implementation**

- Order Submission
  - Validates menu item consistency upon order submission. Applies Optimistic Locking to handle concurrency issues when menu items have limited availability.
  - Produces order messages to Redis Streams so the kitchen can receive them.

**Security Considerations**

The following validation logic is required to block orders from outside the restaurant:

- Client IP validation (verify the request originates from the restaurant's network)
- GPS coordinate validation (calculate distance from the restaurant's location)
- Combination of both conditions to prevent bypass attempts

### Admin API

Provides APIs for restaurant owners and staff.

**Key Features**

- Menu registration and management
- Table-specific billing summary
- Order status management

## Sequence Diagram

![sequencediagram](/asset/image/20251226_order_sq.svg)
