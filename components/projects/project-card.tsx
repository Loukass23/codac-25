import {
  Edit,
  ExternalLink,
  Github,
  MessageSquare,
  MoreHorizontal,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// import { ProjectLikeButton } from '@/components/projects/project-like-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectDTO } from '@/data/projects/get-projects';
import { getProjectUrl } from '@/lib/utils/project-urls';

interface ProjectCardProps {
  project: ProjectDTO;
  showEditActions?: boolean;
  variant?: 'card' | 'list';
}

export function ProjectCard({
  project,
  showEditActions = false,
  variant = 'card',
}: ProjectCardProps) {
  const primaryImage =
    project.images && Array.isArray(project.images) && project.images.length > 0
      ? String(project.images[0])
      : null;

  const projectUrl = getProjectUrl(
    project.projectProfile.user.username,
    project.slug
  );

  if (variant === 'list') {
    return (
      <Card className='group overflow-hidden hover:shadow-md transition-shadow'>
        <div className='flex gap-4 p-6'>
          {/* Project Image */}
          {primaryImage && (
            <div className='flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-lg bg-muted'>
              <Image
                src={primaryImage}
                alt={project.title}
                width={128}
                height={128}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
              />
            </div>
          )}

          {/* Content */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between mb-2'>
              <div className='flex-1 min-w-0 pr-4'>
                <h3 className='font-semibold text-lg leading-tight mb-1'>
                  <Link href={projectUrl} className='hover:underline'>
                    {project.title}
                  </Link>
                </h3>
                <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>
                  {project.shortDesc ?? project.description}
                </p>
              </div>
              {showEditActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 flex-shrink-0'
                    >
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <Link href={projectUrl}>
                        <Edit className='h-4 w-4 mr-2' />
                        Edit Project
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Tech Stack */}
            <div className='mb-3'>
              <div className='flex flex-wrap gap-1'>
                {(project.techStack as string[]).slice(0, 6).map(tech => (
                  <Badge
                    key={tech}
                    variant='outline'
                    className='text-xs px-2 py-0'
                  >
                    {tech}
                  </Badge>
                ))}
                {(project.techStack as string[]).length > 6 && (
                  <Badge variant='outline' className='text-xs px-2 py-0'>
                    +{(project.techStack as string[]).length - 6} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Bottom Row - Author and Actions */}
            <div className='flex items-center justify-between'>
              {/* Author Info */}
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <Avatar className='h-5 w-5'>
                  <AvatarImage src={project.projectProfile.user.avatar || ''} />
                  <AvatarFallback className='text-xs'>
                    {project.projectProfile.user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{project.projectProfile.user.name || 'Anonymous'}</span>
              </div>

              {/* Stats and Actions */}
              <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                {/* Engagement Stats */}
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-1'>
                    <MessageSquare className='h-3 w-3' />
                    <span>{project._count.comments}</span>
                  </div>
                  {project._count.collaborators > 0 && (
                    <div className='flex items-center gap-1'>
                      <User className='h-3 w-3' />
                      <span>{project._count.collaborators}</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className='flex items-center gap-1'>
                  {project.demoUrl && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 w-7 p-0'
                      asChild
                    >
                      <Link
                        href={project.demoUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <ExternalLink className='h-3 w-3' />
                      </Link>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 w-7 p-0'
                      asChild
                    >
                      <Link
                        href={project.githubUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <Github className='h-3 w-3' />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className='group overflow-hidden hover:shadow-lg transition-shadow'>
      {/* Project Image */}
      {primaryImage && (
        <div className='aspect-video overflow-hidden bg-muted'>
          <Image
            src={primaryImage}
            alt={project.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          />
        </div>
      )}

      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1 flex-1'>
            <h3 className='font-semibold leading-tight line-clamp-2'>
              <Link href={projectUrl} className='hover:underline'>
                {project.title}
              </Link>
            </h3>
            <p className='text-sm text-muted-foreground line-clamp-2'>
              {project.shortDesc || project.description}
            </p>
          </div>
          {showEditActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem asChild>
                  <Link href={projectUrl}>
                    <Edit className='h-4 w-4 mr-2' />
                    Edit Project
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className='pb-3'>
        {/* Tech Stack */}
        <div className='space-y-3'>
          <div>
            <div className='text-xs font-medium text-muted-foreground mb-2'>
              Tech Stack
            </div>
            <div className='flex flex-wrap gap-1'>
              {(project.techStack as string[]).slice(0, 4).map(tech => (
                <Badge
                  key={tech}
                  variant='outline'
                  className='text-xs px-2 py-0'
                >
                  {tech}
                </Badge>
              ))}
              {(project.techStack as string[]).length > 4 && (
                <Badge variant='outline' className='text-xs px-2 py-0'>
                  +{(project.techStack as string[]).length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Author Info */}
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Avatar className='h-5 w-5'>
              <AvatarImage src={project?.projectProfile?.user.avatar || ''} />
              <AvatarFallback className='text-xs'>
                {project.projectProfile.user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span>{project.projectProfile.user.name || 'Anonymous'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-0'>
        <div className='flex items-center justify-between w-full text-xs text-muted-foreground'>
          {/* Engagement Stats */}
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1'>
              <MessageSquare className='h-3 w-3' />
              <span>{project._count.comments}</span>
            </div>
            {project._count.collaborators > 0 && (
              <div className='flex items-center gap-1'>
                <User className='h-3 w-3' />
                <span>{project._count.collaborators}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className='flex items-center gap-1'>
            {project.demoUrl && (
              <Button variant='ghost' size='sm' className='h-7 w-7 p-0' asChild>
                <Link
                  href={project.demoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <ExternalLink className='h-3 w-3' />
                </Link>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant='ghost' size='sm' className='h-7 w-7 p-0' asChild>
                <Link
                  href={project.githubUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Github className='h-3 w-3' />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
