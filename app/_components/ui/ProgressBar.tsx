"use client";

import { type FunctionComponent } from 'react';
import { Progress, type ProgressProps } from "flowbite-react";

const theme = {
  "base": "w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
  "label": "mb-1 flex justify-between font-medium dark:text-white",
  "bar": `space-x-2 rounded-full text-center font-semibold leading-none 
  text-cyan-300 dark:text-cyan-100 flex w-full items-center justify-center transition-width duration-500 ease-in-out`, // Added animation here
  "color": {
    "dark": "bg-gray-600 dark:bg-gray-300",
    "blue": "bg-blue-600",
    "red": "bg-red-600 dark:bg-red-500",
    "green": "bg-green-600 dark:bg-green-500",
    "yellow": "bg-yellow-400",
    "indigo": "bg-indigo-600 dark:bg-indigo-500",
    "purple": "bg-purple-600 dark:bg-purple-500",
    "cyan": "bg-cyan-600",
    "gray": "bg-gray-500",
    "lime": "bg-lime-600",
    "pink": "bg-pink-500",
    "teal": "bg-teal-600",
    "secondary": `bg-secondary-accent dark:bg-darkmode-secondary 
    dark:text-neutral-100 text-neutral-100`,
    "completed": `bg-success text-neutral-200 dark:text-green-800 dark:bg-darkmode-success`
  },
  "size": {
    "sm": "h-1.5",
    "md": "h-2.5",
    "lg": "h-4",
    "xl": "h-6"
  }
}

const ProgressBar: FunctionComponent<ProgressProps> = ({
  progress = 0,
  textLabel,
  textLabelPosition = "outside",
  size = "lg",
  labelProgress = true,
  labelText = true,
  progressLabelPosition = "inside"
}) => {
  return (
    <Progress
      theme={theme}
      color={progress >= 100 ? "completed" : "secondary"}
      progress={progress}
      progressLabelPosition={progressLabelPosition}
      textLabel={textLabel}
      textLabelPosition={textLabelPosition}
      size={size}
      labelProgress={labelProgress}
      labelText={labelText}
    />
  )
};

export default ProgressBar;
