'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createDocument } from '@/actions/documents/create-document';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

// Document types for the select
const DOCUMENT_TYPES = [
  { value: 'general', label: 'General Document' },
  { value: 'project_summary', label: 'Project Summary' },
  { value: 'lesson_content', label: 'Lesson Content' },
  { value: 'lms_content', label: 'LMS Content' },
  { value: 'community_post', label: 'Community Post' },
  { value: 'notes', label: 'Personal Notes' },
  { value: 'research', label: 'Research Document' },
  { value: 'tutorial', label: 'Tutorial' },
] as const;

// Access levels
const ACCESS_LEVELS = [
  { value: 'public', label: 'Public' },
  { value: 'all', label: 'All Users' },
  { value: 'web', label: 'Web Cohort' },
  { value: 'data', label: 'Data Cohort' },
  { value: 'admin', label: 'Admin Only' },
] as const;

// Form validation schema
const createDocumentSchema = z.object({
  title: z
    .string()
    .min(1, 'Document title is required')
    .max(200, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  documentType: z.string().min(1, 'Document type is required'),
  isPublished: z.boolean(),
  // LMS-specific fields
  navTitle: z.string().max(100, 'Navigation title too long').optional(),
  metaTitle: z.string().max(200, 'Meta title too long').optional(),
  metaDescription: z.string().max(300, 'Meta description too long').optional(),
  access: z.enum(['public', 'all', 'web', 'data', 'admin']).optional(),
  order: z.number().int().min(0).optional(),
  slug: z.string().max(100, 'Slug too long').optional(),
});

type CreateDocumentFormData = z.infer<typeof createDocumentSchema>;

interface CreateDocumentFormProps {
  selectedFolderId?: string | null;
  onDocumentCreated?: (documentId: string) => void;
  trigger?: React.ReactNode;
}

export function CreateDocumentForm({
  selectedFolderId,
  onDocumentCreated,
  trigger,
}: CreateDocumentFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      title: '',
      description: '',
      documentType: 'general',
      isPublished: false,
      navTitle: '',
      metaTitle: '',
      metaDescription: '',
      access: 'public',
      order: 0,
      slug: '',
    },
  });

  const onSubmit = (data: CreateDocumentFormData) => {
    startTransition(async () => {
      try {
        const result = await createDocument({
          ...data,
          folderId: selectedFolderId || undefined,
          // Convert empty strings to undefined
          navTitle: data.navTitle || undefined,
          metaTitle: data.metaTitle || undefined,
          metaDescription: data.metaDescription || undefined,
          slug: data.slug || undefined,
        });

        if (result.success && result.data) {
          toast.success('Document created successfully!');
          setOpen(false);
          form.reset();
          onDocumentCreated?.(result.data.id);
        } else if (!result.success) {
          toast.error(
            typeof result.error === 'string'
              ? result.error
              : 'Failed to create document'
          );
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
        console.error('Document creation error:', error);
      }
    });
  };

  const defaultTrigger = (
    <Button>
      <FileText className='mr-2 h-4 w-4' />
      Create Document
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Create a new document in your workspace. You can organize it in
            folders and set access permissions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4'>
              {/* Basic Information */}
              <div className='space-y-4'>
                <h3 className='text-sm font-medium'>Basic Information</h3>

                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter document title' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Enter document description'
                          className='resize-none'
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description for your document
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='documentType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select document type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DOCUMENT_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='access'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select access level' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ACCESS_LEVELS.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='isPublished'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>Published</FormLabel>
                        <FormDescription>
                          Make this document visible to others
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Advanced Options */}
              <div className='space-y-4'>
                <h3 className='text-sm font-medium'>Advanced Options</h3>

                <FormField
                  control={form.control}
                  name='navTitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Navigation Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Navigation display title'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Title shown in navigation menus
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='metaTitle'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input placeholder='SEO meta title' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='order'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='0'
                            {...field}
                            onChange={e =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='metaDescription'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='SEO meta description'
                          className='resize-none'
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input placeholder='url-friendly-slug' {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave empty to auto-generate from title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Create Document
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
