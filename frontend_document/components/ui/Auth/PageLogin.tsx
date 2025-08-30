'use client'
import { useForm } from 'react-hook-form'
import { Button } from 'antd'
import { CustomTextField } from '@/components/ui/Input/CustomTextField'
import { CircleUser, KeyRound } from 'lucide-react'
import { ILoginRequest } from '@/types/auth'
import { loginAccount } from '@/actions/auth.actions'
import { getOrCreateDeviceId } from '@/utils/deviceId'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import NotificationService from '@/components/ui/Notification/NotificationService'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

export default function PageLogin() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { loginUser, getInfo } = useAuth()

  const onSubmit = async (data: any) => {
    setLoading(true)
    const deviceId = getOrCreateDeviceId()
    const loginRequest: ILoginRequest = {
      username: data.username,
      password: data.password,
      deviceId: deviceId,
    }
    
    const loadingKey = 'login-loading'
    NotificationService.loading({
      message: 'Đang đăng nhập...',
      description: 'Vui lòng đợi trong giây lát.',
      key: loadingKey,
      duration: 0,
    })

    try {
      await loginUser(loginRequest)
      // Clear loading notification on success
      NotificationService.destroy(loadingKey)
      // Only redirect on successful login
      router.push('/')
    } catch (error) {
      // Clear loading notification on error
      NotificationService.destroy(loadingKey)
      // Login failed - stay on login page
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full h-full flex flex-col justify-center"
    >
      <div className="flex flex-col justify-center space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <CustomTextField
                control={control}
                errors={errors}
                name="username"
                placeholder="Nhập tên đăng nhập"
                icon={<CircleUser size={18} className="text-gray-400" />}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <CustomTextField
                control={control}
                errors={errors}
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                icon={<KeyRound size={18} className="text-gray-400" />}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="pt-2"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-md hover:shadow-lg transition-all duration-300"
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  fontSize: '16px',
                  height: '48px',
                  borderRadius: '16px',
                }}
              >
                {loading ? (
                  <span className="text-white flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang đăng nhập...</span>
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>

        {/* Forgot Password */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-center pt-2"
        >
          <button
            onClick={() => {
              NotificationService.info({
                message: 'Quên mật khẩu?',
                description: 'Vui lòng liên hệ Admin để đặt lại mật khẩu.',
              })
            }}
            className="text-sm text-blue-600 font-bold hover:scale-105 transition-transform duration-200"
          >
            Quên mật khẩu?
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
