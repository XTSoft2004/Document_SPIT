# Demo sử dụng mutate trực tiếp

## Cách sử dụng mutate mới (Mượt mà hơn)

Bây giờ bạn có thể sử dụng mutate trực tiếp như sau:

### 1. Import mutate và mutateTable

```typescript
import { mutate } from 'swr'
import { mutateTable } from '@/utils/swrReload'
```

### 2. Sử dụng mutate trực tiếp với key đơn giản

```typescript
// Mutate cho document table với tham số mặc định
mutate(['document', '', 1, 10])

// Hoặc sử dụng wrapper function
mutateTable('document') // Tương đương với mutate(['document', '', 1, 10])
mutateTable('document', 'search-text', 2, 20) // Custom tham số
```

### 3. Sử dụng trong các action

```typescript
const handleUpdateDocument = async () => {
  const response = await updateDocument(id, data)
  if (response.ok) {
    // Sử dụng mutate trực tiếp - mượt mà hơn, không reload cả table
    mutate(['document', '', 1, 10])
    // Hoặc
    mutateTable('document')
  }
}
```

## So sánh với cách cũ

### Cách cũ (Reload cả table - chậm hơn)

```typescript
// Cách này sẽ trigger reload cả component
reloadTable('document') // Sử dụng event dispatcher
```

### Cách mới (Mutate trực tiếp - mượt mà)

```typescript
// Cách này chỉ update cache SWR, không reload component
mutate(['document', '', 1, 10])
mutateTable('document')
```

## Lưu ý quan trọng

1. **Key SWR đã được đơn giản hóa**: Không còn `internalReloadFlag` nữa
2. **Mutate key phải khớp**: `[nameTable, searchText, pageIndex, pageSize]`
3. **Trải nghiệm mượt mà hơn**: Không reload cả table, chỉ update data

## Các trường hợp sử dụng

### Document

- Khi tạo document mới: `mutateTable('document')`
- Khi cập nhật document: `mutateTable('document')`
- Khi thay đổi trạng thái: `mutateTable('document')`

### User

- Khi tạo user mới: `mutateTable('user')`
- Khi cập nhật user: `mutateTable('user')`
- Khi thay đổi role/lock: `mutateTable('user')`

## Test

Để test xem có hoạt động không:

1. Mở console trong browser
2. Gõ: `mutate(['document', '', 1, 10])` hoặc `window.mutateTable('document')`
3. Quan sát table có update không
