import { Controller } from 'react-hook-form';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { ReactNode } from 'react';

interface CustomTextFieldProps {
  control: any;
  errors: { [key: string]: any };
  name: string;
  placeholder: string;
  type?: 'text' | 'password';
  icon?: ReactNode;
}

export function CustomTextField({
  control,
  errors,
  name,
  placeholder,
  type = 'text',
  icon,
}: CustomTextFieldProps) {
  const hasError = !!errors[name];
  const errorMessage = errors[name]?.message;

  return (
    <div style={{ marginTop: 12 }}>
      <Controller
        name={name}
        control={control}
        rules={{ required: `${placeholder} không được bỏ trống` }}
        render={({ field }) =>
          type === 'password' ? (
            <Input.Password
              {...field}
              size="large"
              placeholder={placeholder}
              prefix={
                icon ? (
                  <span style={{ marginRight: 10, display: 'flex', alignItems: 'center' }}>
                    {icon}
                  </span>
                ) : undefined
              }
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{ paddingTop: 13, paddingBottom: 13, width: '100%' }}
              status={hasError ? 'error' : ''}
            />
          ) : (
            <Input
              {...field}
              size="large"
              placeholder={placeholder}
              prefix={
                icon ? (
                  <span style={{ marginRight: 10, display: 'flex', alignItems: 'center' }}>
                    {icon}
                  </span>
                ) : undefined
              }
              style={{ paddingTop: 13, paddingBottom: 13, width: '100%' }}
              status={hasError ? 'error' : ''}
            />
          )
        }
      />
      {hasError && (
        <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
