import type { ButtonProps } from 'node_modules/react-daisyui/dist/Button'
import React from 'react'
import { Button as DaisyButton } from 'react-daisyui'
// import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "app/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, ...props }, ref) => {
        return (
            // <Theme dataTheme="dark">
            <DaisyButton
                className={cn(className)}
                ref={ref}
                {...props}
            />
            // </Theme>
        )
    }
)

Button.displayName = "Button"

export default Button