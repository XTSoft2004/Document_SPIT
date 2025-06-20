// utils/NotificationService.ts
import { notification } from 'antd'
import type { NotificationArgsProps } from 'antd'

class NotificationService {
  private static instance: NotificationService
  private api = notification

  private defaultPlacement: NotificationArgsProps['placement'] = 'topRight'
  private defaultDuration: number = 5 // ✅ Timeout 5 giây

  private constructor() {}

  public static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private withDefaults(options: NotificationArgsProps): NotificationArgsProps {
    return {
      placement: this.defaultPlacement,
      duration: this.defaultDuration,
      ...options,
    }
  }

  public info(options: NotificationArgsProps) {
    this.api.info(this.withDefaults(options))
  }

  public success(options: NotificationArgsProps) {
    this.api.success(this.withDefaults(options))
  }

  public warning(options: NotificationArgsProps) {
    this.api.warning(this.withDefaults(options))
  }

  public error(options: NotificationArgsProps) {
    this.api.error(this.withDefaults(options))
  }

  public open(options: NotificationArgsProps) {
    this.api.open(this.withDefaults(options))
  }

  public destroy() {
    this.api.destroy()
  }
}

export default NotificationService.getInstance()
