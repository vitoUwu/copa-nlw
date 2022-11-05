import React from 'react';
import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'

interface ButtonProps extends IButtonProps {
  title: string
  type?: 'GOOGLE_LOGIN' | 'PRIMARY'
}

export function Button({ title, type = 'PRIMARY', ...props }: ButtonProps) {
  return (
    <NativeBaseButton
      {...props}
      width={'full'}
      h={14}
      rounded='sm'
      fontSize='md'
      textTransform='uppercase'
      bg={type === 'GOOGLE_LOGIN' ? 'red.500' : 'yellow.500'}
      _pressed={{
        bg: type === 'GOOGLE_LOGIN' ? 'red.600' : 'yellow.600'
      }}
    >
      <Text
        color={type === 'GOOGLE_LOGIN' ? 'white' : 'black'}
        fontSize='sm'
        fontFamily='heading'
      >
        { title }
      </Text>
    </NativeBaseButton>
  );
}