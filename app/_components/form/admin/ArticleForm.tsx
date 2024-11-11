// 'use client';

// import { useForm } from 'react-hook-form';
// import {
//   Form,
//   FormField,
// } from '../../ui/form';
// import type * as z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '../../ui/input';
// import { Alert } from 'react-daisyui';
// import Button from 'app/_components/ui/daisyui/Button';
// // import InfoWithLink from 'app/_components/form/elements/InfoWithLink';
// import AuthInput from 'app/_components/form/elements/AuthInput';
// import { api } from "app/trpc/react";
// import InputsWrapper from 'app/_components/form/elements/InputsWrapper';
// import { articleValidator } from '@root/app/validators/article';

// const FormSchema = articleValidator

// const ArticleForm = () => {

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       h1: '',
//       anchor: '',
//       slug: '',
//       content: '',
//       lang: '',
//       image: '',
//       author: '',
//       // date: new Date(),
//       key: '',
//       group: '',
//       categories: '',
//       tags: ''
//     },
//   });

//   const addGroup = api.article.add.useMutation();

//   const onSubmit = (values: z.infer<typeof FormSchema>) => {
//     addGroup.mutate(values);
//   };

//   const fields = [
//     {
//       name: 'title',
//       label: 'Title',
//       placeholder: 'Title',
//       type: 'text'
//     },
//     {
//       name: 'metaTitle',
//       label: 'Meta title',
//       placeholder: 'Meta title',
//       type: 'text'
//     },
//     {
//       name: 'metaDescription',
//       label: 'Meta description',
//       placeholder: 'Meta description',
//       type: 'text'
//     },
//     {
//       name: 'slug',
//       label: 'Slug',
//       placeholder: 'Slug',
//       type: 'text'
//     },
//     {
//       name: 'content',
//       label: 'Content',
//       placeholder: 'Content',
//       type: 'textarea'
//     },
//     {
//       name: 'lang',
//       label: 'Language',
//       placeholder: 'Language',
//       type: 'text'
//     },
//     {
//       name: 'image',
//       label: 'Image',
//       placeholder: 'Image',
//       type: 'text'
//     },
//     {
//       name: 'author',
//       label: 'Author',
//       placeholder: 'Author',
//       type: 'text'
//     },
//     // {
//     //   name: 'date',
//     //   label: 'Date',
//     //   placeholder: 'Date',
//     //   type: 'date'
//     // },
//     {
//       name: 'key',
//       label: 'Key',
//       placeholder: 'Key',
//       type: 'text'
//     },
//     {
//       name: 'group',
//       label: 'Group',
//       placeholder: 'Group',
//       type: 'text'
//     },
//     {
//       name: 'categories',
//       label: 'Categories',
//       placeholder: 'Categories',
//       type: 'text'
//     },
//     {
//       name: 'tags',
//       label: 'Tags',
//       placeholder: 'Tags',
//       type: 'text'
//     }
//   ] as const

//   return (
//     <Form {...form}>
//       <h1 className='text-3xl font-bold'>Add article group</h1>
//       <form onSubmit={form.handleSubmit(onSubmit)} className='w-[520px]'>
//         {
//           fields.map(({ name, placeholder }, index) => {
//             return (
//               <InputsWrapper key={index}>
//                 <FormField
//                   name={name}
//                   control={form.control}
//                   render={({ field }) => (
//                     <AuthInput label={field.name}>
//                       <Input placeholder={placeholder} {...field} />
//                     </AuthInput>
//                   )}
//                 />
//               </InputsWrapper>
//             )
//           })
//         }
//         {/* <InputsWrapper>
//           <FormField
//             control={form.control}
//             name='title'
//             render={({ field }) => (
//               <AuthInput label='Title'>
//                 <Input placeholder='Title' {...field} />
//               </AuthInput>
//             )}
//           />
//         </InputsWrapper> */}
//         {addGroup.error && (
//           <Alert
//             status='warning'
//             className='mt-4'
//             icon={<i className='fas fa-exclamation-triangle'></i>}
//           >
//             {addGroup.error.message}
//           </Alert>
//         )}
//         {addGroup.data && (
//           <Alert
//             status='success'
//             className='mt-4'
//             icon={<i className='fas fa-check'></i>}
//           >
//             Group added
//           </Alert>
//         )}
//         <Button
//           className='mt-6'
//           type='submit'
//           color='primary'
//           loading={addGroup.isPending}
//           fullWidth
//         >
//           Add article
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default ArticleForm;
