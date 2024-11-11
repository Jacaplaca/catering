'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
} from '../../ui/form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from 'react-daisyui';
import Button from 'app/_components/ui/daisyui/Button';
import AuthInput from '@root/app/_components/ui/Inputs/AuthInput';
import { api } from "app/trpc/react";
import InputsWrapper from '@root/app/_components/ui/Inputs/InputsWrapper';
import { formStandardCallbacks } from '@root/app/lib/utils';
import { generateArticles } from '@root/app/validators/article';

const FormSchema = generateArticles

const ArticlesGeneratorForm = () => {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      count: 1,
    },
  });

  const articleGenerator = api.article.generateFakeArticles.useMutation(formStandardCallbacks);

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    articleGenerator.mutate(values);
  };

  return (
    <Form {...form}>
      <h1 className='text-3xl font-bold'>Generate fake articles</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-[320px]'>
        <InputsWrapper className='mb-8'>
          <FormField
            control={form.control}
            name='count'
            render={({ field }) => (
              <AuthInput label='Count'>
                <input placeholder='10' {...field}
                  {...form.register("count", {
                    setValueAs: (v: string | undefined) => parseInt(v ?? '1') || 1
                  })}
                />
              </AuthInput>
            )}
          />
        </InputsWrapper>
        {articleGenerator.error && (
          <Alert
            status='warning'
            className='mt-4'
            icon={<i className='fas fa-exclamation-triangle'></i>}
          >
            {articleGenerator.error.message}
          </Alert>
        )}
        {articleGenerator.data && (
          <Alert
            status='success'
            className='mt-4'
            icon={<i className='fas fa-envelope'></i>}
          >
            Articles generated
          </Alert>
        )}
        <Button
          className='mt-6'
          type='submit'
          color='primary'
          loading={articleGenerator.isPending}
          fullWidth
        >
          Generate articles
        </Button>
      </form>
    </Form>
  );
};

export default ArticlesGeneratorForm;
