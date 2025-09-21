'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

import type { CreateProjectData } from '@/types/portfolio';

type ProjectFormFocusedProps = {
    onSubmit: (data: CreateProjectData) => Promise<{ error?: string } | void>;
    isLoading?: boolean;
};

export function ProjectFormFocused({ onSubmit, isLoading = false }: ProjectFormFocusedProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateProjectData>({
        title: '',
        description: '',
        shortDesc: '',
        techStack: [],
        features: [],
        demoUrl: '',
        githubUrl: '',
        status: 'PLANNING',
        isPublic: true,
    });
    const [techInput, setTechInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Project title is required');
            return;
        }

        if (!formData.description.trim()) {
            toast.error('Project description is required');
            return;
        }

        const result = await onSubmit(formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success('Project created successfully!');
        }
    };

    const addTechStack = () => {
        if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
            setFormData(prev => ({
                ...prev,
                techStack: [...prev.techStack, techInput.trim()]
            }));
            setTechInput('');
        }
    };

    const removeTechStack = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter(t => t !== tech)
        }));
    };

    const addFeature = () => {
        if (featureInput.trim() && !formData.features?.includes(featureInput.trim())) {
            setFormData(prev => ({
                ...prev,
                features: [...(prev.features || []), featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const removeFeature = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features?.filter(f => f !== feature) || []
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter your project title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your project"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shortDesc">Short Description</Label>
                        <Input
                            id="shortDesc"
                            value={formData.shortDesc || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                            placeholder="Brief one-line description"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tech Stack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            placeholder="Add technology (e.g., React, Node.js)"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                        />
                        <Button type="button" onClick={addTechStack} variant="outline">
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.techStack.map((tech) => (
                            <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                                {tech}
                                <button
                                    type="button"
                                    onClick={() => removeTechStack(tech)}
                                    className="ml-1 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            placeholder="Add feature"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        />
                        <Button type="button" onClick={addFeature} variant="outline">
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.features?.map((feature) => (
                            <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                                {feature}
                                <button
                                    type="button"
                                    onClick={() => removeFeature(feature)}
                                    className="ml-1 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="githubUrl">GitHub URL</Label>
                        <Input
                            id="githubUrl"
                            type="url"
                            value={formData.githubUrl || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                            placeholder="https://github.com/username/repo"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="demoUrl">Demo URL</Label>
                        <Input
                            id="demoUrl"
                            type="url"
                            value={formData.demoUrl || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                            placeholder="https://your-demo-site.com"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Project'}
                </Button>
            </div>
        </form>
    );
}
