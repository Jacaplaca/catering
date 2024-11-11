import Link from 'next/link';
import { type FunctionComponent } from 'react';

const LinkBox: FunctionComponent<{ label: string, links: { url: string, title: string }[] }> = ({ label, links }) => {
    return (
        <div className={`p-8  rounded-md bg-gray-100 dark:bg-zinc-800`}>
            <div className='flex flex-row gap-2 items-center'>
                <i className="fas fa-lightbulb p-0 m-0 text-yellow-400"></i>
                <h4 className='p-0 text-lg m-0'>
                    {label}
                </h4>
            </div>
            <ul className="list-none">
                {links.map(({ url, title }) => (
                    <li key={url}>
                        <Link href={url}>
                            <div>{title}</div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LinkBox;