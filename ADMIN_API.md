# Admin API

Документация по админским ручкам backend-приложения.

Базовый префикс: `/api/admin`

Авторизация:
- Почти все ручки требуют `Authorization: Bearer <accessToken>`
- Публичные ручки помечены отдельно

Формат:
- `Content-Type: application/json` для обычных запросов
- `multipart/form-data` только для загрузки файлов

## Auth

### `POST /api/admin/auth/login`

Публичная ручка.

Принимает:

```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

Отдает:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "fullName": "Site Admin",
    "roles": ["admin"]
  }
}
```

### `POST /api/admin/auth/bootstrap`

Публичная временная ручка для создания первого администратора.

Принимает:

```json
{
  "email": "admin@example.com",
  "password": "secret123",
  "fullName": "Site Admin"
}
```

Отдает:

```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "fullName": "Site Admin",
    "roles": ["admin"]
  }
}
```

### `POST /api/admin/auth/refresh`

Требует Bearer token.

Принимает:
- Только заголовок `Authorization`

Отдает:

```json
{
  "accessToken": "new-jwt-token"
}
```

### `POST /api/admin/auth/logout`

Требует Bearer token.

Принимает:
- Только заголовок `Authorization`

Отдает:

```json
{
  "success": true
}
```

### `GET /api/admin/auth/me`

Требует Bearer token.

Принимает:
- Только заголовок `Authorization`

Отдает:

```json
{
  "id": 1,
  "email": "admin@example.com",
  "fullName": "Site Admin",
  "roles": ["admin"]
}
```

## Products

### Модель продукта в ответах

```json
{
  "id": "1",
  "sku": "SKU-001",
  "slug": "track-svetilnik-sigma-12w",
  "title": "Трековый светильник Sigma 12W",
  "price": "12990.00",
  "inStock": true,
  "description": "Описание товара",
  "img": [
    {
      "url": "/uploads/file.webp",
      "sortOrder": 0
    }
  ],
  "specifications": {
    "мощность": "12W"
  },
  "discount": {
    "hasDiscount": true,
    "new_price": "9990.00"
  },
  "categories": {
    "main": {
      "id": 1,
      "name": "Трековые системы",
      "imageUrl": "/uploads/main.webp",
      "description": "Главная категория"
    },
    "subA": {
      "id": 2,
      "name": "Подкатегория A",
      "imageUrl": "/uploads/suba.webp",
      "description": "Описание subA"
    },
    "subB": {
      "id": 3,
      "name": "Подкатегория B",
      "imageUrl": "/uploads/subb.webp",
      "description": "Описание subB"
    }
  },
  "isActive": true,
  "createdAt": "2026-03-18T10:00:00.000Z",
  "updatedAt": "2026-03-18T10:00:00.000Z"
}
```

### `GET /api/admin/products`

Принимает:
- Ничего, кроме Bearer token

Отдает:
- Массив продуктов в формате выше

### `POST /api/admin/products`

Принимает:

```json
{
  "title": "Трековый светильник Sigma 12W",
  "price": "12990.00",
  "inStock": true,
  "description": "Описание товара",
  "img": [
    {
      "url": "/uploads/file.webp",
      "sortOrder": 0
    }
  ],
  "specifications": {
    "мощность": "12W"
  },
  "discount": {
    "hasDiscount": true,
    "new_price": "9990.00"
  },
  "categories": {
    "main": { "id": 1, "name": "Трековые системы" },
    "subA": { "id": 2, "name": "Подкатегория A" },
    "subB": { "id": 3, "name": "Подкатегория B" }
  },
  "slug": "track-svetilnik-sigma-12w",
  "sku": "SKU-001",
  "isActive": true
}
```

Примечания:
- `title` и `price` обязательны
- Достаточно передать один из `categories.main/subA/subB.id`, но обычно передается вся цепочка
- Если `discount.hasDiscount=true`, то `discount.new_price` обязателен

Отдает:
- Созданный продукт в формате модели продукта

### `GET /api/admin/products/:id`

Принимает:
- Параметр пути `id`

Отдает:
- Один продукт в формате модели продукта

### `PATCH /api/admin/products/:id`

Принимает:
- Параметр пути `id`
- Любые поля из `POST /products`, все необязательные

Отдает:
- Обновленный продукт в формате модели продукта

### `DELETE /api/admin/products/:id`

Принимает:
- Параметр пути `id`

Отдает:

```json
{
  "success": true
}
```

## Categories

### Модель категории

```json
{
  "id": 1,
  "name": "Трековые системы",
  "slug": "track-systems",
  "imageUrl": "/uploads/category.webp",
  "description": "Описание категории",
  "parentId": null,
  "sortOrder": 0,
  "isActive": true,
  "createdAt": "2026-03-18T10:00:00.000Z",
  "updatedAt": "2026-03-18T10:00:00.000Z"
}
```

### Дерево категорий

```json
[
  {
    "id": 1,
    "name": "Трековые системы",
    "slug": "track-systems",
    "imageUrl": "/uploads/main.webp",
    "description": "Описание main",
    "parentId": null,
    "isActive": true,
    "sortOrder": 0,
    "subcategoriesA": [
      {
        "id": 2,
        "name": "Подкатегория A",
        "slug": "sub-a",
        "imageUrl": "/uploads/suba.webp",
        "description": "Описание subA",
        "parentId": 1,
        "isActive": true,
        "sortOrder": 0,
        "subcategoriesB": [
          {
            "id": 3,
            "name": "Подкатегория B",
            "slug": "sub-b",
            "imageUrl": "/uploads/subb.webp",
            "description": "Описание subB",
            "parentId": 2,
            "isActive": true,
            "sortOrder": 0
          }
        ]
      }
    ]
  }
]
```

### `GET /api/admin/categories`

Принимает:
- Ничего, кроме Bearer token

Отдает:
- Массив категорий в формате модели категории

### `GET /api/admin/categories/tree`

Публичная ручка.

Принимает:
- Ничего

Отдает:
- Дерево категорий в формате выше

### `POST /api/admin/categories`

Принимает:

```json
{
  "name": "Трековые системы",
  "slug": "track-systems",
  "imageUrl": "/uploads/category.webp",
  "description": "Описание категории",
  "parentId": null,
  "sortOrder": 0,
  "isActive": true
}
```

Примечания:
- `name` и `slug` обязательны
- `parentId=null` создает корневую категорию
- Можно создавать только 3 уровня: `main -> subA -> subB`

Отдает:
- Созданную категорию в формате модели категории

### `POST /api/admin/categories/:parentId/subcategories`

Принимает:
- Параметр пути `parentId`
- Тот же body, что и `POST /categories`, но `parentId` можно не передавать, он возьмется из URL

Отдает:
- Созданную подкатегорию в формате модели категории

### `PATCH /api/admin/categories/:id`

Принимает:
- Параметр пути `id`
- Любые поля из `POST /categories`, все необязательные

Отдает:
- Обновленную категорию в формате модели категории

### `DELETE /api/admin/categories/:id`

Удаляет всю подветку категории.

Принимает:
- Параметр пути `id`

Отдает:

```json
{
  "success": true
}
```

## Brands

### Модель бренда

```json
{
  "id": 1,
  "name": "Nordic Aluminium",
  "slug": "nordic-aluminium",
  "description": "Описание бренда",
  "isActive": true,
  "createdAt": "2026-03-18T10:00:00.000Z",
  "updatedAt": "2026-03-18T10:00:00.000Z"
}
```

### `GET /api/admin/brands`

Принимает:
- Ничего, кроме Bearer token

Отдает:
- Массив брендов

### `POST /api/admin/brands`

Принимает:

```json
{
  "name": "Nordic Aluminium",
  "slug": "nordic-aluminium",
  "description": "Описание бренда"
}
```

Отдает:
- Созданный бренд

### `PATCH /api/admin/brands/:id`

Принимает:
- Параметр пути `id`
- Любые поля бренда

Отдает:
- Обновленный бренд

### `DELETE /api/admin/brands/:id`

Принимает:
- Параметр пути `id`

Отдает:

```json
{
  "success": true
}
```

## Orders

### Модель заказа

```json
{
  "id": 1,
  "orderNumber": "ORD-001",
  "status": "NEW",
  "customer": "Иван Иванов",
  "phone": "+79991234567",
  "email": "ivan@example.com",
  "comment": "Комментарий",
  "total": "12990.00",
  "items": [
    {
      "id": 1,
      "orderId": 1,
      "productId": 10,
      "productName": "Товар",
      "price": "12990.00",
      "quantity": 1
    }
  ],
  "createdAt": "2026-03-18T10:00:00.000Z",
  "updatedAt": "2026-03-18T10:00:00.000Z"
}
```

### `GET /api/admin/orders`

Принимает:
- Ничего, кроме Bearer token

Отдает:
- Массив заказов

### `GET /api/admin/orders/:id`

Принимает:
- Параметр пути `id`

Отдает:
- Один заказ

### `PATCH /api/admin/orders/:id`

Принимает:

```json
{
  "status": "IN_WORK",
  "customer": "Иван Иванов",
  "phone": "+79991234567",
  "email": "ivan@example.com",
  "comment": "Перезвонить позже"
}
```

Отдает:
- Обновленный заказ

## Leads

### Модель лида

```json
{
  "id": 1,
  "name": "Иван",
  "phone": "+79991234567",
  "source": "project-page",
  "status": "new",
  "comment": "Перезвонить вечером",
  "createdAt": "2026-03-18T10:00:00.000Z"
}
```

### `GET /api/admin/leads`

Принимает:
- Ничего, кроме Bearer token

Отдает:
- Массив лидов

### `PATCH /api/admin/leads/:id`

Принимает:

```json
{
  "name": "Иван",
  "phone": "+79991234567",
  "source": "project-page",
  "status": "processed",
  "comment": "Связались"
}
```

Отдает:
- Обновленный лид

## News

### Модель новости

```json
{
  "id": 1,
  "slug": "new-warehouse-opening",
  "title": "Открытие нового склада",
  "content": "Текст новости...",
  "status": "PUBLISHED",
  "publishedAt": "2026-03-10T00:00:00.000Z",
  "createdAt": "2026-03-18T10:00:00.000Z",
  "updatedAt": "2026-03-18T10:00:00.000Z"
}
```

### `GET /api/admin/news`

Принимает:
- Ничего, кроме Bearer token

Отдает:
- Массив новостей

### `POST /api/admin/news`

Принимает:

```json
{
  "slug": "new-warehouse-opening",
  "title": "Открытие нового склада",
  "content": "Текст новости...",
  "status": "PUBLISHED",
  "publishedAt": "2026-03-10T00:00:00.000Z"
}
```

Отдает:
- Созданную новость

### `PATCH /api/admin/news/:id`

Принимает:
- Параметр пути `id`
- Любые поля новости

Отдает:
- Обновленную новость

### `DELETE /api/admin/news/:id`

Принимает:
- Параметр пути `id`

Отдает:

```json
{
  "success": true
}
```

## Articles

По структуре полностью повторяют новости.

### `GET /api/admin/articles`

Отдает:
- Массив статей

### `POST /api/admin/articles`

Принимает:

```json
{
  "slug": "how-to-choose-light",
  "title": "Как выбрать свет",
  "content": "Текст статьи...",
  "status": "PUBLISHED",
  "publishedAt": "2026-03-10T00:00:00.000Z"
}
```

Отдает:
- Созданную статью

### `PATCH /api/admin/articles/:id`

Принимает:
- Параметр пути `id`
- Любые поля статьи

Отдает:
- Обновленную статью

### `DELETE /api/admin/articles/:id`

Отдает:

```json
{
  "success": true
}
```

## Projects

### Модель проекта

```json
{
  "id": 1,
  "slug": "ashan-schelkovo",
  "title": "Освещение проекта",
  "content": "Полное описание проекта",
  "status": "PUBLISHED",
  "images": [
    {
      "id": 1,
      "projectId": 1,
      "url": "/uploads/project-1.webp",
      "sortOrder": 0
    }
  ],
  "equipment": [
    {
      "id": 1,
      "projectId": 1,
      "name": "Nordic Aluminium SKB 12-3",
      "description": "Скоба крепления",
      "imageUrl": "/uploads/equipment.webp",
      "productUrl": "https://example.com/products/e1",
      "price": "149.19",
      "sortOrder": 0
    }
  ],
  "createdAt": "2026-03-18T10:00:00.000Z",
  "updatedAt": "2026-03-18T10:00:00.000Z"
}
```

### `GET /api/admin/projects`

Отдает:
- Массив проектов

### `POST /api/admin/projects`

Принимает:

```json
{
  "slug": "ashan-schelkovo",
  "title": "Освещение проекта",
  "content": "Полное описание проекта",
  "status": "PUBLISHED",
  "images": [
    {
      "url": "/uploads/project-1.webp",
      "sortOrder": 0
    }
  ],
  "equipment": [
    {
      "name": "Nordic Aluminium SKB 12-3",
      "description": "Скоба крепления",
      "imageUrl": "/uploads/equipment.webp",
      "productUrl": "https://example.com/products/e1",
      "price": 149.19,
      "sortOrder": 0
    }
  ]
}
```

Отдает:
- Созданный проект

### `PATCH /api/admin/projects/:id`

Принимает:
- Параметр пути `id`
- Любые поля проекта

Примечание:
- Если передать `images` или `equipment`, текущие коллекции будут полностью пересозданы

Отдает:
- Обновленный проект

### `DELETE /api/admin/projects/:id`

Отдает:

```json
{
  "success": true
}
```

## Pages

### Модель страницы

```json
{
  "id": 1,
  "slug": "about",
  "title": "О компании",
  "content": "Текст страницы...",
  "status": "PUBLISHED",
  "createdAt": "2026-03-18T10:00:00.000Z",
  "updatedAt": "2026-03-18T10:00:00.000Z"
}
```

### `GET /api/admin/pages`

Отдает:
- Массив страниц

### `POST /api/admin/pages`

Принимает:

```json
{
  "slug": "about",
  "title": "О компании",
  "content": "Текст страницы...",
  "status": "PUBLISHED"
}
```

Отдает:
- Созданную страницу

### `PATCH /api/admin/pages/:id`

Принимает:
- Параметр пути `id`
- Любые поля страницы

Отдает:
- Обновленную страницу

### `DELETE /api/admin/pages/:id`

Отдает:

```json
{
  "success": true
}
```

## Files

### `GET /api/admin/files/:id`

Принимает:
- Параметр пути `id`

Отдает:
- Бинарное содержимое файла

### `GET /api/admin/files/:id/meta`

Принимает:
- Параметр пути `id`

Отдает:

```json
{
  "id": "0f5d6f71-2c32-4a8b-b529-f86c191f5b30",
  "filename": "0f5d6f71-2c32-4a8b-b529-f86c191f5b30.webp",
  "extension": ".webp",
  "url": "/uploads/0f5d6f71-2c32-4a8b-b529-f86c191f5b30.webp",
  "mimeType": "image/webp",
  "size": 245612
}
```

### `POST /api/admin/files/upload`

Принимает:
- `multipart/form-data`
- Поле `file`

Ограничения:
- Только изображения
- До `10 MB`

Отдает:

```json
{
  "id": "0f5d6f71-2c32-4a8b-b529-f86c191f5b30",
  "url": "/uploads/0f5d6f71-2c32-4a8b-b529-f86c191f5b30.webp",
  "originalName": "preview.webp",
  "mimeType": "image/webp",
  "size": 245612
}
```

### `DELETE /api/admin/files/:id`

Принимает:
- Параметр пути `id`

Отдает:

```json
{
  "success": true,
  "deletedFileId": "0f5d6f71-2c32-4a8b-b529-f86c191f5b30"
}
```

## Imports

### `POST /api/admin/import/price`

Сейчас stub-ручка.

Принимает:
- Ничего, кроме Bearer token

Отдает:

```json
{
  "id": "job-1710768000000",
  "status": "queued",
  "createdAt": "2026-03-18T10:00:00.000Z"
}
```

### `POST /api/admin/import/categories`

Принимает один объект:

```json
{
  "main": "main_name",
  "subA": [
    {
      "name": "subA_name",
      "subB": ["sub-b-1", "sub-b-2"]
    }
  ]
}
```

Или batch:

```json
{
  "categories": [
    {
      "main": "main_name",
      "subA": [
        {
          "name": "subA_name",
          "subB": ["sub-b-1", "sub-b-2"]
        }
      ]
    }
  ]
}
```

Отдает:

```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "main_name",
      "slug": "main-name",
      "imageUrl": null,
      "description": null,
      "parentId": null,
      "sortOrder": 0,
      "isActive": true,
      "subA": [
        {
          "id": 2,
          "name": "subA_name",
          "slug": "suba-name",
          "imageUrl": null,
          "description": null,
          "parentId": 1,
          "sortOrder": 0,
          "isActive": true,
          "subB": [
            {
              "id": 3,
              "name": "sub-b-1",
              "slug": "sub-b-1",
              "imageUrl": null,
              "description": null,
              "parentId": 2,
              "sortOrder": 0,
              "isActive": true
            }
          ]
        }
      ]
    }
  ],
  "count": 1
}
```

### `GET /api/admin/import/jobs/:id`

Принимает:
- Параметр пути `id`

Отдает:

```json
{
  "id": "job-1710768000000",
  "status": "queued",
  "createdAt": "2026-03-18T10:00:00.000Z"
}
```

## Audit Logs

### `GET /api/admin/audit-logs`

Принимает:
- Ничего, кроме Bearer token

Отдает:

```json
[
  {
    "id": 1,
    "userId": 1,
    "action": "product.updated",
    "entity": "Product",
    "entityId": "10",
    "payload": {
      "title": "Новое название"
    },
    "createdAt": "2026-03-18T10:00:00.000Z",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "fullName": "Site Admin"
    }
  }
]
```
