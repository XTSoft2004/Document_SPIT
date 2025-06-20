// utils/deviceId.ts
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '' // tránh chạy ở server

  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = generateUUID()
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
