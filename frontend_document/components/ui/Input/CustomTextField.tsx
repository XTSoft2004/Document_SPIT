import { Controller } from 'react-hook-form';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined } from '@ant-design/icons';
import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomTextFieldProps {
  control: any;
  errors: { [key: string]: any };
  name: string;
  placeholder: string;
  type?: 'text' | 'password';
  icon?: ReactNode;
  label?: string;
}

export function CustomTextField({
  control,
  errors,
  name,
  placeholder,
  type = 'text',
  icon,
  label,
}: CustomTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const hasError = !!errors[name];
  const errorMessage = errors[name]?.message;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: any) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Floating Label */}
      {label && (
        <AnimatePresence>
          <motion.label
            className={`absolute left-4 z-10 px-2 text-sm font-medium transition-all duration-200 ${isFocused || hasValue
                ? 'top-[-8px] text-blue-600 bg-white dark:bg-gray-900'
                : 'top-4 text-gray-500'
              } ${hasError ? 'text-red-500' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        </AnimatePresence>
      )}

      <Controller
        name={name}
        control={control}
        rules={{ required: `${placeholder} is required` }}
        render={({ field }) =>
          type === 'password' ? (<Input.Password
            {...field}
            size="large"
            placeholder={label ? '' : placeholder}
            onFocus={handleFocus}
            onBlur={(e) => {
              field.onBlur();
              handleBlur(e);
            }}
            onChange={(e) => {
              field.onChange(e);
              setHasValue(!!e.target.value);
            }}
            prefix={
              icon ? (
                <motion.span
                  className={`mr-3 flex items-center transition-all duration-300 ${isFocused
                      ? 'text-blue-500 scale-110'
                      : hasError
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {icon}
                </motion.span>
              ) : undefined
            }
            suffix={
              !hasError && hasValue ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircleOutlined className="text-green-500" />
                </motion.div>
              ) : undefined
            }
            iconRender={(visible) =>
              visible ? (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <EyeTwoTone twoToneColor="#3b82f6" />
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <EyeInvisibleOutlined className="text-gray-400 hover:text-gray-600 transition-colors" />
                </motion.div>
              )
            }
            className={`
                modern-input
                ${hasError
                ? 'border-red-400 focus:border-red-500 shadow-red-100'
                : isFocused
                  ? 'border-blue-500 shadow-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              }
                transition-all duration-300 ease-out
                bg-white/70 hover:bg-white focus:bg-white
                rounded-2xl shadow-sm hover:shadow-md focus:shadow-xl
                backdrop-blur-sm border-2
                ${isFocused ? 'scale-[1.02]' : 'scale-100'}
              `}
            style={{
              padding: label ? '20px 16px 12px 16px' : '16px',
              fontSize: '15px',
              fontWeight: '500',
              height: '60px',
              lineHeight: '1.4'
            }}
          />
          ) : (<Input
            {...field}
            size="large"
            placeholder={label ? '' : placeholder}
            onFocus={handleFocus}
            onBlur={(e) => {
              field.onBlur();
              handleBlur(e);
            }}
            onChange={(e) => {
              field.onChange(e);
              setHasValue(!!e.target.value);
            }}
            prefix={
              icon ? (
                <motion.span
                  className={`mr-3 flex items-center transition-all duration-300 ${isFocused
                      ? 'text-blue-500 scale-110'
                      : hasError
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {icon}
                </motion.span>
              ) : undefined
            }
            suffix={
              !hasError && hasValue ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircleOutlined className="text-green-500" />
                </motion.div>
              ) : undefined
            }
            className={`
                modern-input
                ${hasError
                ? 'border-red-400 focus:border-red-500 shadow-red-100'
                : isFocused
                  ? 'border-blue-500 shadow-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              }
                transition-all duration-300 ease-out
                bg-white/70 hover:bg-white focus:bg-white
                rounded-2xl shadow-sm hover:shadow-md focus:shadow-xl
                backdrop-blur-sm border-2
                ${isFocused ? 'scale-[1.02]' : 'scale-100'}
              `}
            style={{
              padding: label ? '20px 16px 12px 16px' : '16px',
              fontSize: '15px',
              fontWeight: '500',
              height: '60px',
              lineHeight: '1.4'
            }}
          />
          )
        }
      />

      {/* Enhanced error message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2"
          >
            <motion.div
              className="flex items-center px-3 py-2 text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-xl shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </motion.svg>
              <span className="leading-tight">{errorMessage}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success indicator */}
      <AnimatePresence>
        {!hasError && hasValue && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 right-4 pointer-events-none"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
