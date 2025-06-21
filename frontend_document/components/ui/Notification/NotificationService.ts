// utils/NotificationService.ts
import { notification } from 'antd'
import type { NotificationArgsProps } from 'antd'
import React from 'react'
import { Spin } from 'antd'

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
      ...options,
      message: options.message || 'Thông báo',
      placement: this.defaultPlacement,
      duration: this.defaultDuration,
    }
  }

  public loading(
    options: NotificationArgsProps & {
      icon?: React.ReactNode
      message?: React.ReactNode
    },
  ) {
    // Use Ant Design's Spin component for proper spinning animation
    const defaultIcon = React.createElement(Spin, {
      style: { marginRight: 12, marginTop: -5 },
    })

    this.api.open({
      ...this.withDefaults(options),
      icon: options.icon ?? defaultIcon,
      message: options.message ?? 'Đang xử lý...',
      duration: this.defaultDuration,
      key: options.key || 'loading',
    })
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
