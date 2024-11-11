'use client';

import Button from 'app/_components/ui/daisyui/Button';
import { api } from "app/trpc/react";
import { formStandardCallbacks } from '@root/app/lib/utils';

const RemoveGeneratedArticles = () => {
  const fakeArticlesRemover = api.article.removeFakeArticles.useMutation(formStandardCallbacks);

  return (
    <Button
      className='mt-6'
      type='submit'
      color='primary'
      loading={fakeArticlesRemover.isPending}
      fullWidth
      onClick={() => {
        fakeArticlesRemover.mutate();
      }}
    >
      Remove fake articles
    </Button>
  );
};

export default RemoveGeneratedArticles;
