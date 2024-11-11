import Link from 'next/link';
import type { FunctionComponent, ReactNode } from 'react';

type LinkType = {
  href: string,
  label: string
};

const InfoWithLink: FunctionComponent<{
  info: string,
  links?: LinkType[]
}> = ({ info, links }) => {
  const renderTextWithLinks = (text: string, links: LinkType[]): ReactNode[] => {
    const regex = new RegExp(links.map(link => link.label).join("|"), "gi");

    const parts: ReactNode[] = [];
    let lastIndex = 0;

    text.replace(regex, (match: string, offset: number): string => {
      parts.push(text.slice(lastIndex, offset));

      const link = links.find(link => new RegExp(link.label, "gi").test(match));
      if (link) {
        parts.push(
          <Link
            key={offset}
            href={link.href}
            className='dark:text-blue-500 text-blue-600 hover:underline'>
            {match}
          </Link>
        );
      }
      lastIndex = offset + match.length;
      return match;
    });

    parts.push(text.slice(lastIndex));
    return parts;
  };

  return (
    <p className='text-center text-sm dark:text-gray-400 text-gray-700 mt-2'>
      {Array.isArray(links) ? renderTextWithLinks(info, links) : info}
    </p>
  );
};

export default InfoWithLink;