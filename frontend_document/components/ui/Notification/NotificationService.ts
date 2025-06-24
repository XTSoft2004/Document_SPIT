// utils/NotificationService.ts
import { notification } from 'antd'
import type { NotificationArgsProps } from 'antd'
import React from 'react'
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'

class NotificationService {
  private static instance: NotificationService
  private api = notification

  private defaultPlacement: NotificationArgsProps['placement'] = 'topRight'
  private defaultDuration: number = 4
  private defaultStyle = {
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(95, 87, 87, 0.06)',
    fontSize: '13px',
    padding: '12px 16px',
    minHeight: 'auto',
    width: '320px',
  }

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
      style: { ...this.defaultStyle, ...options.style },
    }
  }

  public loading(
    options: NotificationArgsProps & {
      icon?: React.ReactNode
      message?: React.ReactNode
    },
  ) {
    const loadingIcon = React.createElement(LoadingOutlined, {
      style: {
        color: '#1890ff',
        fontSize: '14px',
        marginRight: '6px',
      },
      spin: true,
    })

    this.api.open({
      ...this.withDefaults(options),
      icon: options.icon ?? loadingIcon,
      message: options.message ?? 'Đang xử lý...',
      duration: 0,
      key: options.key || 'loading',
      style: {
        ...this.defaultStyle,
        borderLeft: '3px solid #1890ff',
        ...options.style,
      },
    })
  }

  public info(options: NotificationArgsProps) {
    this.api.info({
      ...this.withDefaults(options),
      icon: React.createElement(InfoCircleOutlined, {
        style: { color: '#1890ff', fontSize: '14px' },
      }),
      style: {
        ...this.defaultStyle,
        borderLeft: '3px solid #1890ff',
        ...options.style,
      },
    })
  }

  public success(options: NotificationArgsProps) {
    this.api.success({
      ...this.withDefaults(options),
      icon: React.createElement(CheckCircleOutlined, {
        style: { color: '#52c41a', fontSize: '14px' },
      }),
      style: {
        ...this.defaultStyle,
        borderLeft: '3px solid #52c41a',
        ...options.style,
      },
    })
  }

  public warning(options: NotificationArgsProps) {
    this.api.warning({
      ...this.withDefaults(options),
      icon: React.createElement(ExclamationCircleOutlined, {
        style: { color: '#faad14', fontSize: '14px' },
      }),
      style: {
        ...this.defaultStyle,
        borderLeft: '3px solid #faad14',
        ...options.style,
      },
    })
  }

  public error(options: NotificationArgsProps) {
    this.api.error({
      ...this.withDefaults(options),
      icon: React.createElement(CloseCircleOutlined, {
        style: { color: '#ff4d4f', fontSize: '14px' },
      }),
      duration: 6,
      style: {
        ...this.defaultStyle,
        borderLeft: '3px solid #ff4d4f',
        ...options.style,
      },
    })
  }

  public open(options: NotificationArgsProps) {
    this.api.open(this.withDefaults(options))
  }

  public destroy(key?: string) {
    if (key) {
      this.api.destroy(key)
    } else {
      this.api.destroy()
    }
  }

  public close(key: string) {
    this.api.destroy(key)
  }
}

export default NotificationService.getInstance()
