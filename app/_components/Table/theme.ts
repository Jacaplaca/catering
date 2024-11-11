'use client';

const tableTheme = {
    root: {
        base: `w-full text-left text-sm text-neutral-500 dark:text-neutral-400 dark:bg-darkmode-table-darker 
        bg-neutral-50 dark:bg-neutral-800`,
        shadow: "hidden absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-white drop-shadow-md dark:bg-black",
        wrapper: "static"
    },
    body: {
        base: "group/body",
        cell: {
            base: `px-4 py-4
            group-first/body:group-first/row:first:rounded-tl-lg
            group-first/body:group-first/row:last:rounded-tr-lg
            group-last/body:group-last/row:first:rounded-bl-lg
            group-last/body:group-last/row:last:rounded-br-lg`
        }
    },
    head: {
        base: `group/head text-xs uppercase text-neutral-700 dark:text-neutral-400
        border-b dark:border-neutral-700 dark:bg-neutral-900
        bg-neutral-50 dark:bg-darkmode-table-darker`,
        cell: {
            base: "px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg"
        }
    },
    row: {
        base: `group/row
        border-t hover:bg-neutral-100 dark:border-neutral-700
        bg-neutral-50 dark:bg-darkmode-table-darker
        `,
        hovered: `hover:bg-neutral-100 dark:hover:bg-neutral-800`,
        striped: `odd:bg-white even:bg-neutral-50
        odd:dark:bg-darkmode-table-lighter even:dark:bg-neutral-800`,
        last: `border-b border-neutral-100 dark:border-neutral-700 bg-green-300 dark:bg-red-400`
    }
}

export default tableTheme;