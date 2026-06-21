# Project Description

Facteur is a mail toolkit made of:

- Facteur Relay: the core service. Define providers (smtp, aws ses, resend, sendgrid etc) and send emails through them with a simple to use API and an api key
- Facteur Form: allows to handle form submissions with a simple url: receive a form request, send the data via email/webhook, redirect the user. It will also handle captcha verification (recaptcha, cloudflare turnstile, cap captcha & more)
- Facteur News: a dead simple newsletter tool. Create lists, add subscribers, send an email to the list using a defined provider.

# Task Tracking

Use dex (and related skill) when planning execution. Split tasks into subtask and move their status as you go through them. Make sure to signal when meeting blockers and such.

# Conventions

## Stack

- auth: better-auth
- db: drizzle
- ui/components: shadcn

## Architecture

- Prefer reusing code wherever possible (i.e. on an api endpoint, use the same server function as you would for a query).
- Components should be isolated to avoid prop drilling if possible: use tanstack query to dedupe requests
- Use inngest for long running/background jobs

## Design Context

### Users

Facteur is designed first for developers and operators who configure and monitor mail infrastructure. They use it while setting up sender domains, DNS verification, providers, API keys, delivery status, form endpoints, and newsletter flows, often in implementation or troubleshooting mode. The interface should help them understand system state quickly, act with confidence, and recover from configuration issues without feeling like they are in a marketing site.

### Brand Personality

Facteur should feel like calm technical utility: precise, composed, and trustworthy. The voice should be plain-spoken, direct, and steady. UI copy should reduce uncertainty around email, DNS, authentication, API keys, and delivery behavior by making consequences and next actions clear.

### Aesthetic Direction

Use the existing React, Inertia, Tailwind v4, shadcn base-nova, lucide, and Geist-based direction as the foundation: compact controls, readable cards, crisp borders, restrained motion, and scan-friendly dashboard layouts. Polish light and dark modes equally, with a stronger but measured brand color system that supports hierarchy, status, charts, and primary actions without overwhelming the operational UI. Avoid generic SaaS hero gloss, oversized marketing composition, flashy gradients, stock imagery, and decorative visuals that do not expose real product state.

### Design Principles

- Favor operational clarity over decoration: make state, risk, and next actions obvious.
- Keep screens compact, predictable, and built for repeated use by technical users.
- Use brand color with intent for hierarchy and feedback, while preserving strong contrast in both light and dark modes.
- Prefer real product surfaces, tables, forms, code snippets, DNS records, and delivery data over abstract illustration.
- Design for confidence under pressure: errors, empty states, loading states, and destructive actions should be calm, explicit, and accessible.

## React Components

Prefer using small components whenever possible; when building a page, said page should have the least amount of state as possible. Nested components should handle state when it can be encapsulated (think a table, a form etc)
