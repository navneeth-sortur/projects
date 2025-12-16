# 📘 Wikipedia Viewer

A simple, elegant, and modern **Wikipedia Viewer** built using **React**, **TypeScript**, and **Vite**.  
This application allows users to search Wikipedia articles and open a random article using the official **MediaWiki API**.

This project is inspired by the freeCodeCamp Wikipedia Viewer challenge.

---

## 🚀 Features

- 🔍 Search Wikipedia articles in real time
- 🎲 Open a random Wikipedia article
- 📄 View article titles with short descriptions
- 🔗 Open full Wikipedia articles in a new tab
- ⚡ Fast development using Vite
- 🛡 Type-safe code using TypeScript
- 🎨 Simple, clean, and modern UI

---

## 🛠 Tech Stack

- **React** (Functional Components + Hooks)
- **TypeScript**
- **Vite**
- **MediaWiki API**
- **CSS** (No external UI libraries)

---

## 🌐 MediaWiki API

This project uses the official MediaWiki API to fetch search results.

Search Endpoint Used

- https://en.wikipedia.org/w/api.php

---

## Key Parameters

- action=query
- list=search
- srsearch=<search term>
- format=json
- origin=\* (required for CORS)

---

## 🎯 User Stories (freeCodeCamp)

- ✅ I can search Wikipedia entries in a search box and see the resulting Wikipedia entries.

- ✅ I can click a button to see a random Wikipedia entry.

---

## 🧠 Key Learnings

- Building scalable React apps using TypeScript
- Proper separation of concerns
- Handling API requests and loading states
- Clean component-driven architecture
- Using dangerouslySetInnerHTML safely for trusted content
