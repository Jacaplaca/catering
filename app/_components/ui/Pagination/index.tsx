'use client';
import React, { useCallback, type FunctionComponent } from "react";
import { type Locale } from '@root/i18n-config';
import { env } from '@root/app/env';
import Dropdown from '@root/app/_components/ui/Inputs/Dropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import PageNumberInput from '@root/app/_components/ui/Pagination/PageNumberInput';
import translate from '@root/app/lib/lang/translate';
import ChevronButton from '@root/app/_components/ui/Pagination/ChevronButton';
import makeHref from '@root/app/lib/url/makeHref';
import getPagination from '@root/app/lib/getPagination';

const Pagination: FunctionComponent<{
  lang: Locale;
  group: string;
  dictionary?: Record<string, string>;
  totalCount: number;
}> = ({
  lang = env.DEFAULT_LOCALE,
  group,
  totalCount,
  dictionary = {},
}) => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const {
      page: currentPage,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
      firstElement,
      lastElement,
    } = getPagination(new URLSearchParams(searchParams.toString()), totalCount);

    const makePaginationUrl = useCallback(
      (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value);
        if (name === 'limit') {
          params.set('page', '1');
        }
        return makeHref({ lang, page: group, slugs: [], params }, true);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams]
    )

    const onChangeLimit = (value: string) => {
      const url = makePaginationUrl("limit", value);
      router.push(url);
    }

    const handleTypePage = (value: number) => {
      const url = makePaginationUrl("page", value.toString());
      router.push(url);
    }

    const limits = [10, 20, 50, 100].map((value) => ({ label: value.toString(), value: value.toString() }));

    return (
      <>
        {totalPages > 1 && (
          <nav
            className="pagination  flex items-center justify-between py-2 font-sans w-full"
            aria-label="Pagination"
          >
            <div className="flex items-center gap-2" >
              <span>{translate(dictionary, 'shared:per_page')}</span>
              <Dropdown
                onChange={onChangeLimit}
                options={limits}
                value={limit.toString()}
                styles={{
                  control:
                  {
                    width: '70px',
                  }
                }}
              />
              <div className="flex items-center ml-4">
                <span>{translate(dictionary, 'shared:page', [currentPage, totalPages])}</span>
              </div>
              <div className="flex items-center ml-4">
                {/* <span>{translate(dictionary, 'shared:page', [currentPage, totalPages])}</span> */}
                <span>{translate(dictionary, 'shared:showing', [firstElement, lastElement, totalCount])}</span>
                {/* {firstElement} - {lastElement} {totalCount} */}
              </div>
            </div>
            <div className="flex items-center">
              <ChevronButton
                direction='left'
                double
                disabled={!hasPrevPage}
                url={makePaginationUrl("page", "1")}
              />
              <ChevronButton
                direction='left'
                disabled={!hasPrevPage}
                url={makePaginationUrl("page", `${currentPage - 1}`)}
              />

              <PageNumberInput
                redirect={handleTypePage}
                currentPage={currentPage}
                totalPages={totalPages}
              />

              <ChevronButton
                direction='right'
                disabled={!hasNextPage}
                url={makePaginationUrl("page", `${currentPage + 1}`)}
              />
              <ChevronButton
                direction='right'
                double
                disabled={!hasNextPage}
                url={makePaginationUrl("page", totalPages.toString())}
              />
            </div>
          </nav>
        )}
      </>
    );
  };

export default Pagination;
