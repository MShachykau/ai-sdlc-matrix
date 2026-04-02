# Архитектура решения: React SPFx + SharePoint

## Общая концепция

```
SharePoint Lists (данные)
        ↓ PnPjs / Graph API
SPFx Web Part (React приложение)
        ↓
Матрица (таблица) → Modal с карточкой
```

Приложение пакуется как **SPFx Web Part** и добавляется на страницу `CollabHome.aspx`. Данные хранятся в **двух SharePoint Lists** на том же сайте.

---

## 1. Структура данных в SharePoint

### List 1: `InvolvementMatrix`

Лёгкая таблица для рендера матрицы (91 строка макс). Отвечает на вопрос — нужна ли ячейка и какой значок показать. Если строки `developer|testing` нет — прочерк в таблице.

| Колонка | Тип SharePoint | Пример значений |
|---|---|---|
| `Phase` | Choice | `planning`, `requirements`, `design-architecture`, `development`, `testing`, `deployment-release`, `maintenance` |
| `Role` | Choice | `developer`, `qa`, `po`, `pm`, `ba`, `ux-ui`, `architect`, `tech-lead`, `dba`, `devops`, `tech-writer`, `scrum-master`, `link` |
| `Involvement` | Choice | `lead`, `active`, `review`, `on-demand`, `none` |

### List 2: `MatrixCells`

Полный контент карточки. Одна строка = один уровень одной ячейки. Для полной ячейки `developer×development` — 3 строки (по одной на каждый AI Level).

| Колонка | Тип SharePoint | Пример |
|---|---|---|
| `Phase` | Choice | `development` |
| `Role` | Choice | `developer` |
| `AILevel` | Choice | `ai-enabled`, `ai-first`, `ai-native` |
| `CardContent` | Multiple lines of text (plain) | JSON-строка с полным `CardContent` объектом |

**Почему JSON в одну колонку:** структура `CardContent` сложная — вложенные массивы объектов (tools, links, practices, metrics). Хранить каждое поле отдельно — 20+ колонок и боль при редактировании. JSON-в-колонке проще, и в SharePoint это нормальная практика для конфигурационных данных.

### Пример JSON для поля `CardContent`

```json
{
  "title": "Feature development with AI assistant",
  "shift": "You stop writing code line by line...",
  "tools": [
    {
      "name": "GitHub Copilot",
      "description": "In-IDE autocomplete and chat",
      "badge": "key",
      "url": "https://github.com/features/copilot"
    }
  ],
  "links": [
    {
      "title": "Best practices for AI-Assisted Coding",
      "url": "https://example.com",
      "type": "article",
      "duration": "8 min",
      "why": "Covers review discipline and prompt patterns"
    }
  ],
  "practices": [
    "Delegate whole tasks, not single lines",
    "Always review AI output before merging"
  ],
  "expectations": {
    "minimum": "Can use Copilot for basic autocomplete",
    "normal": "Delegates full functions with clear prompts",
    "advanced": "Orchestrates multi-file refactors via agent mode"
  },
  "antipatterns": [
    "Merging AI output without review",
    "Using AI for tasks you don't understand"
  ],
  "metrics": [
    { "label": "PR acceptance rate", "target": "> 70%" }
  ]
}
```

---

## 2. Технологический стек

| Технология | Назначение |
|---|---|
| **SharePoint Framework (SPFx) 1.20+** | Хостинг React-приложения внутри SharePoint |
| **React 18 + TypeScript** | UI (адаптируем текущий код) |
| **PnPjs v4** (`@pnp/sp`) | Работа с SharePoint Lists (CRUD, без ручного auth) |
| **Tailwind CSS** | Стили (через PostCSS в SPFx) |
| **Fluent UI v9** (опционально) | Нативные для SharePoint компоненты (Modal, Spinner) |

**Почему PnPjs:** в SPFx контексте он автоматически получает токен из SharePoint-сессии пользователя — не нужно настраивать MSAL или регистрировать Azure AD app.

---

## 3. Архитектура React-приложения

Текущий `useMatrixState` читает из URL-параметров. В SPFx-версии источник данных меняется:

```
src/
├── data/
│   ├── types.ts              ← без изменений
│   ├── matrix.ts             ← удаляем (данные теперь из SharePoint)
│   └── sharepointApi.ts      ← НОВЫЙ: функции загрузки из Lists
├── hooks/
│   ├── useMatrixState.ts     ← без изменений (URL-sync)
│   └── useSharePointData.ts  ← НОВЫЙ: загрузка + парсинг
├── components/               ← без изменений
└── webparts/
    └── MatrixWebPart.ts      ← SPFx entry point
```

### `sharepointApi.ts` — ключевой модуль

```typescript
// Загрузка InvolvementMatrix → Map<"phase|role", InvolvementType>
async function fetchInvolvementMap(sp: SPFI): Promise<Map<string, InvolvementType>>

// Загрузка CardContent для конкретной ячейки + уровня (по клику, lazy)
async function fetchCardContent(
  sp: SPFI,
  phase: SDLCPhase,
  role: Role,
  level: AILevel
): Promise<CardContent | null>
```

### `useSharePointData.ts` — хук загрузки

```typescript
const { involvementMap, loading, error } = useSharePointData()
```

- **При старте:** загружает только `InvolvementMatrix` (лёгкий список) → рисует таблицу
- **При клике на ячейку:** lazy-загрузка конкретного `MatrixCells` item → открывает Modal

---

## 4. Логика рендера таблицы

```
Для каждой ячейки [phase, role]:
  ├── Есть запись в InvolvementMatrix?
  │     НЕТ → показываем "—" (неактивная ячейка)
  │     ДА  → показываем badge с цветом involvement
  │            При клике → lazy fetch CardContent из MatrixCells
  │              ├── Нашли? → открываем Modal
  │              └── Не нашли? → Modal с "Content coming soon"
```

---

## 5. Редактирование данных

Редактирование через **стандартный интерфейс SharePoint** (List Forms) — не нужно писать отдельный редактор для SPFx.

**Рабочий процесс для контент-менеджера:**
1. Открывает список `MatrixCells` в SharePoint
2. Добавляет/редактирует строку (Phase + Role + AILevel + CardContent JSON)
3. Для удобства генерации JSON — использует текущий `CellEditorModal` из Vite-приложения как утилиту: заполняет форму → скачивает JSON → вставляет в SharePoint List item

---

## 6. Деплой

```bash
# 1. Сборка production bundle
gulp bundle --ship
gulp package-solution --ship

# 2. Загрузка .sppkg в App Catalog тенанта
#    (через SharePoint Admin Center → Apps → App Catalog)

# 3. Установка app на сайт
#    https://maksimshachykau.sharepoint.com/sites/AI-SDLCRoleMatrix

# 4. Добавление Web Part на страницу
#    CollabHome.aspx → Edit Page → Add Web Part → MatrixWebPart
```

---

## 7. Поэтапный план реализации

| # | Этап | Задача | Инструменты |
|---|---|---|---|
| 1 | **SharePoint Lists** | Создать два списка с нужными колонками и choice-значениями | SharePoint UI |
| 2 | **SPFx проект** | Инициализировать (`yo @microsoft/sharepoint`), настроить TypeScript + Tailwind | Node.js, Yeoman |
| 3 | **Перенос компонентов** | Скопировать компоненты из текущего Vite-проекта в SPFx, адаптировать imports | — |
| 4 | **Data layer** | Написать `sharepointApi.ts` + `useSharePointData.ts` с PnPjs | PnPjs v4 |
| 5 | **Тестовые данные** | Заполнить Lists тестовыми строками для проверки рендера | SharePoint UI |
| 6 | **Деплой** | Собрать `.sppkg`, загрузить в App Catalog, добавить на страницу | gulp |
| 7 | **Стили** | Проверить конфликты Tailwind со SharePoint, при необходимости добавить prefix | PostCSS |

---

## 8. Ключевые риски и решения

| Риск | Решение |
|---|---|
| Tailwind CSS конфликтует со SharePoint глобальными стилями | CSS Modules + Tailwind prefix или переход на Fluent UI |
| JSON в поле `CardContent` невалидный (ошибка при вводе) | Валидация при fetch + fallback на пустую карточку с сообщением |
| SharePoint API rate limits при большом числе пользователей | Кешировать `involvementMap` в React state, lazy load карточек по клику |
| SPFx версия Node.js (требует Node 18) | Использовать `.nvmrc` или nvm для переключения версий |

---

## Ссылки

- SharePoint сайт: https://maksimshachykau.sharepoint.com/sites/AI-SDLCRoleMatrix/SitePages/CollabHome.aspx
- SPFx документация: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/
- PnPjs v4: https://pnp.github.io/pnpjs/
