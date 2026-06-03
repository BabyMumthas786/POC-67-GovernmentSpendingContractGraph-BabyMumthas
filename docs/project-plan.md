# Project Plan

## POC Number

67

## POC Title

Government Spending Contract Graph

## Rail Category

Procurement / Public Spending Intelligence

## Goal

Build a full-stack intelligence platform that visualizes how government funds flow from agencies to vendors through awarded contracts. The system enables users to explore spending patterns, identify major recipients, analyze procurement trends, and understand government spending concentration over time.

## Data Sources

### Primary Sources

* USAspending.gov API
* SAM.gov API

### Secondary Sources

* Synthetic Contract Dataset
* Generated Agency, Vendor, and Contract Relationship Data

## APIs

### USAspending.gov API

Purpose:
Retrieve government spending and contract award information.

### SAM.gov API

Purpose:
Supplementary government contracting information.

## Expected Intelligence

The platform should answer:

* Which agencies spend the most money?
* Which vendors receive the most contracts?
* How does spending change over time?
* Which sectors receive the highest funding?
* Are contracts concentrated among a few vendors?
* What relationships exist between agencies and contractors?

## Core Features

### Feature 1

Interactive Contract Relationship Graph

### Feature 2

Analytics Dashboard

### Feature 3

Advanced Filtering System

### Feature 4

Timeline Scrubber

### Feature 5

Contract Detail Drawer

### Feature 6

Data Export Functionality

### Feature 7

Why This Matters Panel

### Feature 8

Who Controls The Rail Panel

## Required Features

* Agency-to-Vendor Network Graph
* Award Analytics Dashboard
* Spending Trend Analysis
* Top Agencies Ranking
* Top Vendors Ranking
* Contract Details Drawer
* Dynamic Filters
* CSV / JSON Export
* Mock Data Fallback

## Tech Stack

### Frontend

* Next.js 14
* TypeScript
* Tailwind CSS
* shadcn/ui
* Cytoscape.js
* Apache ECharts

### Backend

* FastAPI
* Pandas
* Pydantic

### Database

* DuckDB

### Deployment

* Vercel (Frontend)
* Render or Railway (Backend)

## Mock Data Requirement

YES

Reason:
Government APIs may experience downtime, rate limits, incomplete records, or connectivity issues during demonstrations. A synthetic fallback dataset ensures the application remains fully functional.
