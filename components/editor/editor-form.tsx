import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plate, PlateContent, usePlateEditor } from 'platejs/react';

type FormValues = {
    content: any;
};

export function EditorForm() {
    // 1. Create the form
    const form = useForm<FormValues>({
        defaultValues: {
            content: [
                { type: 'p', children: [{ text: 'Hello from shadcn/ui Form!' }] },
            ],
        },
    });

    // 2. Create the Plate editor
    const editor = usePlateEditor();

    const onSubmit = (data: FormValues) => {
        console.info('Submitted data:', data.content);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Plate
                                    editor={editor}
                                    onChange={({ value }) => {
                                        // Sync to the form
                                        field.onChange(value);
                                    }}
                                >
                                    <PlateContent placeholder="Type..." />
                                </Plate>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <button type="submit">Submit</button>
            </form>
        </Form>
    );
}
