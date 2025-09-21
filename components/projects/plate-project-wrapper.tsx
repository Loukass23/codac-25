



import { cn } from '@/lib/utils';
import { Edit, Link } from 'lucide-react';
import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { PlateEditorStatic } from '../editor/plate-editor-static';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface PlateProjectWrapperProps {
    plateValue: Value;
    title: string;
    description: string;
    showEditButton?: boolean;
    editLink?: string;
    className?: string;
}

export function PlateProjectWrapper({ plateValue, title, description, showEditButton, editLink, className }: PlateProjectWrapperProps) {
    const editor = usePlateEditor({
        value: plateValue || [],
    });

    return (
        <Plate editor={editor}>
            <div className={cn("max-w-4xl mx-auto p-2", className)}>
                {/* Header */}
                {(title || description || showEditButton) && (
                    <div className="mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                {title && (
                                    <h1 className="text-4xl font-bold mb-4 mt-6 border-b-2 border-gray-200 dark:border-gray-700 pb-3">
                                        {title}
                                    </h1>
                                )}
                                {description && (
                                    <p className="text-lg my-4 leading-relaxed text-gray-700 dark:text-gray-300">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {showEditButton && editLink && (
                                <div className="ml-4 mt-6">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={editLink}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardContent>
                                <PlateEditorStatic
                                    plateValue={plateValue || []}
                                    className="prose prose-lg max-w-none dark:prose-invert"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Plate>
    );
}   